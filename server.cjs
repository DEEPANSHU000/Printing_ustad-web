const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// ─── Load .env.local ───────────────────────────────────────────────────────────
const envPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex === -1) continue;
        const key = trimmed.slice(0, eqIndex).trim();
        const value = trimmed.slice(eqIndex + 1).trim();
        if (key && !process.env[key]) process.env[key] = value;
    }
    console.log('✅ Loaded .env.local');
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));
const PORT = process.env.PORT || 5001;

// ─── Supabase Admin Client ─────────────────────────────────────────────────────
let supabaseAdmin = null;
const supabaseUrl    = (process.env.VITE_SUPABASE_URL        || '').trim();
const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (supabaseUrl && serviceRoleKey && !serviceRoleKey.startsWith('YOUR_')) {
    const { createClient } = require('@supabase/supabase-js');
    supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
    console.log('✅ Supabase Admin (service role) initialized – RLS bypassed.');
} else {
    console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY is missing or still a placeholder in .env.local.');
}

// ─── Razorpay ─────────────────────────────────────────────────────────────────
let razorpayInstance = null;
const rzpKeyId     = (process.env.VITE_RAZORPAY_KEY_ID || '').trim();
const rzpKeySecret = (process.env.RAZORPAY_KEY_SECRET   || '').trim();

if (rzpKeyId && rzpKeySecret && !rzpKeySecret.startsWith('YOUR_')) {
    const Razorpay = require('razorpay');
    razorpayInstance = new Razorpay({ key_id: rzpKeyId, key_secret: rzpKeySecret });
    console.log('✅ Razorpay initialized.');
} else {
    console.warn('⚠️  RAZORPAY_KEY_SECRET is missing or still a placeholder in .env.local.');
}

// ─── Delhivery ────────────────────────────────────────────────────────────────
// Delhivery uses a static API Token (no login/refresh needed).
// Get it from: Delhivery One panel → Settings → API Setup
// Staging base: https://staging-express.delhivery.com
// Production base: https://track.delhivery.com
const DELHIVERY_BASE      = (process.env.DELHIVERY_API_BASE || 'https://track.delhivery.com').trim();
const delhiveryToken      = (process.env.DELHIVERY_API_TOKEN   || '').trim();
const delhiveryPickupName = (process.env.DELHIVERY_PICKUP_NAME || 'Printing Ustad').trim();

// Pickup warehouse details (your warehouse that Delhivery will pick up from)
const pickupDetails = {
    name:    delhiveryPickupName,
    add:     (process.env.DELHIVERY_PICKUP_ADDRESS || 'Your Warehouse Address').trim(),
    city:    (process.env.DELHIVERY_PICKUP_CITY    || 'Delhi').trim(),
    state:   (process.env.DELHIVERY_PICKUP_STATE   || 'Delhi').trim(),
    country: 'India',
    pin:     (process.env.DELHIVERY_PICKUP_PINCODE || '110001').trim(),
    phone:   (process.env.DELHIVERY_PICKUP_PHONE   || '9999999999').trim(),
};

const isDelhiveryConfigured = () =>
    !!delhiveryToken && !delhiveryToken.startsWith('YOUR_');

/**
 * Delhivery helper — common headers
 */
const delhiveryHeaders = () => ({
    'Authorization': `Token ${delhiveryToken}`,
    'Content-Type':  'application/json',
    'Accept':        'application/json',
});

/**
 * Checks if a destination pincode is serviceable by Delhivery.
 * Returns { serviceable: true/false, message }
 */
async function checkDelhiveryServiceability(pincode) {
    try {
        const res = await fetch(
            `${DELHIVERY_BASE}/c/api/pin-codes/json/?filter_codes=${pincode}`,
            { headers: delhiveryHeaders() }
        );
        const data = await res.json();
        const pinData = data?.delivery_codes?.[0]?.postal_code;
        if (pinData && pinData.pre_paid === 'Y') {
            return { serviceable: true, message: `Pincode ${pincode} is serviceable.` };
        }
        return { serviceable: false, message: `Pincode ${pincode} is not serviceable by Delhivery.` };
    } catch (err) {
        console.warn('⚠️  Serviceability check failed (non-fatal):', err.message);
        return { serviceable: true, message: 'Could not verify serviceability.' }; // fail-open
    }
}

/**
 * Creates a Delhivery shipment using the /api/cmu/create.json endpoint.
 * Delhivery accepts shipments as form-encoded data with a JSON "data" field.
 * Returns { waybill, tracking_url, courier_name }
 */
async function createDelhiveryShipment({ supabaseOrderId, shippingAddress, customerName, customerEmail, cartItems }) {
    const totalWeight = Math.max(0.5, cartItems.reduce((s, i) => s + (i.quantity * 0.5), 0));
    const orderTotal  = cartItems.reduce((s, i) => s + (i.price * i.quantity), 0);

    // Delhivery shipment data structure
    const shipmentData = {
        shipments: [
            {
                name:            `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim() || customerName || 'Customer',
                add:             shippingAddress.address  || '',
                add2:            shippingAddress.address2 || '',
                city:            shippingAddress.city     || '',
                state:           shippingAddress.state    || '',
                country:         'India',
                pin:             shippingAddress.pincode  || '',
                phone:           shippingAddress.phone    || '',
                email:           shippingAddress.email    || customerEmail || '',
                order:           supabaseOrderId.slice(0, 30), // Delhivery order reference
                payment_mode:    'Prepaid',
                return_pin:      pickupDetails.pin,
                return_city:     pickupDetails.city,
                return_phone:    pickupDetails.phone,
                return_add:      pickupDetails.add,
                return_state:    pickupDetails.state,
                return_country:  'India',
                products_desc:   cartItems.map(i => i.name || 'Custom Print').join(', ').slice(0, 100),
                hsn_code:        '4911',
                cod_amount:      '0',
                order_date:      new Date().toISOString().split('T')[0],
                total_amount:    String(Math.round(orderTotal)),
                seller_add:      pickupDetails.add,
                seller_name:     pickupDetails.name,
                seller_inv:      supabaseOrderId.slice(0, 20),
                quantity:        String(cartItems.reduce((s, i) => s + i.quantity, 0)),
                waybill:         '',  // blank = Delhivery auto-generates
                shipment_width:  '15',
                shipment_height: '5',
                weight:          String(totalWeight),
                seller_gst_tin:  '',
                shipping_mode:   'Surface',
                address_type:    'home',
            }
        ],
        pickup_location: {
            name:    pickupDetails.name,
            add:     pickupDetails.add,
            city:    pickupDetails.city,
            pin_code: pickupDetails.pin,
            country: 'India',
            phone:   pickupDetails.phone,
        }
    };

    // Delhivery expects form-encoded with data= JSON string
    const formBody = new URLSearchParams();
    formBody.append('format', 'json');
    formBody.append('data', JSON.stringify(shipmentData));

    const createRes = await fetch(`${DELHIVERY_BASE}/api/cmu/create.json`, {
        method:  'POST',
        headers: {
            'Authorization': `Token ${delhiveryToken}`,
            'Content-Type':  'application/x-www-form-urlencoded',
            'Accept':        'application/json',
        },
        body: formBody.toString(),
    });

    const createData = await createRes.json();
    console.log('📦 Delhivery create response:', JSON.stringify(createData));

    if (!createRes.ok || createData.success === false) {
        throw new Error(`Delhivery shipment create failed: ${JSON.stringify(createData)}`);
    }

    // Extract waybill from response
    const pkg         = createData?.packages?.[0];
    const waybill     = pkg?.waybill || null;
    const trackingUrl = waybill ? `https://www.delhivery.com/track/package/${waybill}` : null;
    const courierName = 'Delhivery';

    if (waybill) console.log(`✅ Delhivery waybill created: ${waybill}`);
    else console.warn('⚠️  Delhivery returned no waybill:', JSON.stringify(createData));

    // Request pickup (non-fatal)
    if (waybill) {
        try {
            const pickupBody = new URLSearchParams();
            pickupBody.append('format', 'json');
            pickupBody.append('pd', new Date().toISOString().split('T')[0]);          // pickup date = today
            pickupBody.append('pickup_time', '10:00:00');
            pickupBody.append('pickup_location', pickupDetails.name);
            pickupBody.append('expected_package_count', String(cartItems.reduce((s, i) => s + i.quantity, 0)));

            const pickupRes = await fetch(`${DELHIVERY_BASE}/fm/request/new/`, {
                method:  'POST',
                headers: {
                    'Authorization': `Token ${delhiveryToken}`,
                    'Content-Type':  'application/x-www-form-urlencoded',
                },
                body: pickupBody.toString(),
            });
            const pickupData = await pickupRes.json();
            console.log('✅ Delhivery pickup requested:', JSON.stringify(pickupData));
        } catch (pickupErr) {
            console.warn('⚠️  Delhivery pickup request failed (non-fatal):', pickupErr.message);
        }
    }

    return { waybill, tracking_url: trackingUrl, courier_name: courierName };
}

if (isDelhiveryConfigured()) {
    console.log('✅ Delhivery API token found – shipments will be auto-created after payment.');
} else {
    console.warn('⚠️  DELHIVERY_API_TOKEN not set in .env.local.');
    console.warn('   Get it from: Delhivery One panel → Settings → API Setup');
    console.warn('   Shipments will NOT be created automatically until token is set.');
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        status:             'ok',
        razorpayReady:      !!razorpayInstance,
        supabaseAdminReady: !!supabaseAdmin,
        delhiveryReady:     isDelhiveryConfigured(),
    });
});

// ─── GET /api/check-serviceability/:pincode ───────────────────────────────────
// Lets the frontend verify a pincode is deliverable before checkout.
// Proxy endpoint to bypass CORS for third-party images (allows Canvas toDataURL to work)
app.get('/api/proxy-image', async (req, res) => {
    try {
        const imageUrl = req.query.url;
        if (!imageUrl) return res.status(400).send('URL required');
        
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        
        const contentType = response.headers.get('content-type');
        const arrayBuffer = await response.arrayBuffer();
        
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Content-Type', contentType);
        res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
        res.send(Buffer.from(arrayBuffer));
    } catch (err) {
        console.error("Proxy Image Error:", err.message);
        res.status(500).send('Failed to proxy image');
    }
});

app.get('/api/check-serviceability/:pincode', async (req, res) => {
    try {
        if (!isDelhiveryConfigured()) {
            return res.json({ serviceable: true, message: 'Delhivery not configured – skipping check.' });
        }
        const result = await checkDelhiveryServiceability(req.params.pincode);
        res.json(result);
    } catch (err) {
        res.status(500).json({ serviceable: false, message: err.message });
    }
});

// ─── POST /api/create-order ───────────────────────────────────────────────────
app.post('/api/create-order', async (req, res) => {
    try {
        const { amount, userId, userEmail, cartItems, subtotal, shipping, tax, total, shippingAddress } = req.body;

        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: 'A valid amount (in paise) is required.' });
        }
        if (!razorpayInstance) {
            return res.status(503).json({
                error: 'Razorpay is not configured on the server.',
                hint: 'Add your real RAZORPAY_KEY_SECRET to .env.local and restart.'
            });
        }

        // Validate shipping address
        if (!shippingAddress || !shippingAddress.phone || !shippingAddress.pincode) {
            return res.status(400).json({ error: 'Shipping address with phone and pincode is required.' });
        }

        // 1. Ensure profile exists
        if (supabaseAdmin && userId) {
            await supabaseAdmin.from('profiles')
                .upsert({ id: userId, full_name: shippingAddress.firstName || userEmail?.split('@')[0] || 'User' }, { onConflict: 'id' });
        }

        // 2. Create Supabase order
        let supabaseOrderId = null;
        if (supabaseAdmin && userId) {
            const { data: order, error: orderErr } = await supabaseAdmin
                .from('orders')
                .insert({
                    user_id:          userId,
                    status:           'pending',
                    subtotal:         subtotal || 0,
                    shipping_cost:    shipping || 0,
                    tax_amount:       tax      || 0,
                    total_amount:     total    || 0,
                    shipping_address: shippingAddress || {}
                })
                .select()
                .single();

            if (orderErr) {
                console.error('❌ Supabase order insert error:', orderErr.message);
                return res.status(500).json({ error: 'Database Error: Could not save order.', hint: orderErr.message });
            }
            supabaseOrderId = order.id;

            // Create order items
            if (cartItems && cartItems.length > 0) {
                const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                const items = cartItems.map(item => ({
                    order_id:       supabaseOrderId,
                    product_id:     uuidRe.test(item.id) ? item.id : null,
                    variant_id:     item.variantId || null,
                    quantity:       item.quantity,
                    unit_price:     item.price,
                    customizations: item.attributes || {}
                }));
                const { error: itemsErr } = await supabaseAdmin.from('order_items').insert(items);
                if (itemsErr) console.error('⚠️  Order items insert error:', itemsErr.message);
            }
        }

        // 3. Create Razorpay order
        const rzpOrder = await razorpayInstance.orders.create({
            amount:   Math.round(amount),
            currency: 'INR',
            receipt:  `receipt_${Date.now()}`
        });

        res.json({
            razorpayOrderId: rzpOrder.id,
            supabaseOrderId,
            amount:   rzpOrder.amount,
            currency: rzpOrder.currency
        });

    } catch (error) {
        console.error('❌ Error in /api/create-order:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// ─── POST /api/confirm-payment ────────────────────────────────────────────────
// Called after Razorpay success: updates order status + creates Delhivery shipment.
app.post('/api/confirm-payment', async (req, res) => {
    try {
        const { supabaseOrderId, razorpayPaymentId, cartItems, shippingAddress, customerEmail, customerName } = req.body;

        if (!supabaseAdmin || !supabaseOrderId) {
            return res.json({ success: true, delhivery: null });
        }

        // 1. Mark order as 'processing'
        const { error: updateErr } = await supabaseAdmin
            .from('orders')
            .update({ status: 'processing', updated_at: new Date().toISOString() })
            .eq('id', supabaseOrderId);

        if (updateErr) console.error('⚠️  Error updating order status:', updateErr.message);

        // 2. Create Delhivery shipment (non-fatal – never blocks payment success)
        let delhiveryResult = null;
        if (isDelhiveryConfigured() && shippingAddress) {
            try {
                delhiveryResult = await createDelhiveryShipment({
                    supabaseOrderId,
                    shippingAddress,
                    customerName:  customerName  || 'Customer',
                    customerEmail: customerEmail || '',
                    cartItems:     cartItems     || []
                });

                // 3. Persist waybill + tracking info into shipping_address jsonb
                await supabaseAdmin
                    .from('orders')
                    .update({
                        shipping_address: {
                            ...(shippingAddress || {}),
                            delhivery_waybill: delhiveryResult.waybill,
                            awb_code:          delhiveryResult.waybill,   // generic key used on frontend
                            courier_name:      delhiveryResult.courier_name,
                            tracking_url:      delhiveryResult.tracking_url,
                        },
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', supabaseOrderId);

                console.log(`✅ Delhivery waybill saved for order ${supabaseOrderId}: ${delhiveryResult.waybill}`);
            } catch (dlErr) {
                // Log but DO NOT fail — payment already captured
                console.error('⚠️  Delhivery shipment creation failed (non-fatal):', dlErr.message);
            }
        }

        res.json({ success: true, delhivery: delhiveryResult });

    } catch (error) {
        console.error('❌ Error in /api/confirm-payment:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// ─── GET /api/track/:orderId ──────────────────────────────────────────────────
// Returns live tracking data from Delhivery for a given Supabase order ID.
app.get('/api/track/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!supabaseAdmin) return res.status(503).json({ error: 'Supabase not configured.' });

        // Fetch waybill from Supabase
        const { data: order, error } = await supabaseAdmin
            .from('orders')
            .select('shipping_address')
            .eq('id', orderId)
            .single();

        if (error || !order) return res.status(404).json({ error: 'Order not found.' });

        const waybill     = order.shipping_address?.delhivery_waybill || order.shipping_address?.awb_code;
        const trackingUrl = waybill ? `https://www.delhivery.com/track/package/${waybill}` : null;

        if (!waybill) {
            return res.json({ tracked: false, message: 'No waybill assigned yet. Shipment may still be processing.' });
        }

        // If Delhivery not configured, return static tracking URL
        if (!isDelhiveryConfigured()) {
            return res.json({ tracked: false, waybill, tracking_url: trackingUrl, message: 'Delhivery not configured for live tracking.' });
        }

        // Live tracking via Delhivery API
        const trackRes = await fetch(
            `${DELHIVERY_BASE}/api/v1/packages/json/?waybill=${waybill}&verbose=true`,
            { headers: delhiveryHeaders() }
        );
        const trackData = await trackRes.json();
        const pkg        = trackData?.ShipmentData?.[0]?.Shipment;
        const status     = pkg?.Status?.Status || null;
        const statusDesc = pkg?.Status?.Instructions || null;

        res.json({
            tracked:      true,
            waybill,
            tracking_url: trackingUrl,
            status,
            status_desc:  statusDesc,
            data:         trackData,
        });
    } catch (err) {
        console.error('❌ /api/track error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/upload-design ──────────────────────────────────────────────────
app.post('/api/upload-design', async (req, res) => {
    try {
        if (!supabaseAdmin) return res.status(500).json({ error: 'Supabase admin not configured.' });

        const { fileBase64, mimeType, fileName, userId } = req.body;
        if (!fileBase64 || !mimeType) return res.status(400).json({ error: 'Missing fileBase64 or mimeType.' });

        const base64Data  = fileBase64.replace(/^data:[^;]+;base64,/, '');
        const fileBuffer  = Buffer.from(base64Data, 'base64');
        const ext         = (fileName || 'upload').split('.').pop().replace(/[^a-z0-9]/gi, '') || 'png';
        const safeUserId  = (userId || 'anonymous').replace(/[^a-zA-Z0-9-]/g, '');
        const storagePath = `users/${safeUserId}/${Date.now()}_design.${ext}`;

        const { error: uploadErr } = await supabaseAdmin.storage
            .from('design-uploads')
            .upload(storagePath, fileBuffer, { contentType: mimeType, upsert: true });

        if (uploadErr) {
            console.error('❌ Storage upload error:', uploadErr.message);
            return res.status(500).json({ error: uploadErr.message });
        }

        const { data: { publicUrl } } = supabaseAdmin.storage.from('design-uploads').getPublicUrl(storagePath);
        console.log('✅ Design uploaded:', publicUrl);
        res.json({ publicUrl });

    } catch (error) {
        console.error('❌ Error in /api/upload-design:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// ─── POST /api/bulk-enquiry ───────────────────────────────────────────────────
app.post('/api/bulk-enquiry', async (req, res) => {
    try {
        const { name, company, email, phone, qty, deadline, notes, categories } = req.body;

        if (!name || !email || !phone || !qty) {
            return res.status(400).json({ error: 'Missing required fields: name, email, phone, qty.' });
        }

        let savedId = null;
        if (supabaseAdmin) {
            const { data, error: dbErr } = await supabaseAdmin
                .from('bulk_order_enquiries')
                .insert({
                    name:       name.trim(),
                    company:    company?.trim() || null,
                    email:      email.trim().toLowerCase(),
                    phone:      phone.trim(),
                    quantity:   parseInt(qty, 10),
                    deadline:   deadline || null,
                    notes:      notes?.trim() || null,
                    categories: categories || [],
                    status:     'new',
                })
                .select('id')
                .single();

            if (dbErr) {
                console.error('❌ bulk_order_enquiries insert error:', dbErr.message);
            } else {
                savedId = data?.id;
                console.log(`✅ Bulk enquiry saved: ${savedId} from ${email}`);
            }
        }

        const adminEmail = process.env.ADMIN_EMAIL || 'support@printingustad.com';
        const emailBody = `
New Bulk Order Enquiry

From:      ${name}${company ? ` (${company})` : ''}
Email:     ${email}
Phone:     ${phone}
Quantity:  ${qty} units
Deadline:  ${deadline || 'Not specified'}
Products:  ${(categories || []).join(', ') || 'Not selected'}
Notes:     ${notes || '—'}

View in Admin Dashboard → https://your-site.com/admin
        `.trim();

        console.log(`\n📧 ADMIN NOTIFICATION to ${adminEmail}:\n${emailBody}\n`);

        res.json({ success: true, id: savedId, message: 'Enquiry received! We will contact you within 4 business hours.' });

    } catch (error) {
        console.error('❌ Error in /api/bulk-enquiry:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 Backend server running at http://localhost:${PORT}`);
    console.log(`   Health check → http://localhost:${PORT}/api/health\n`);
});
