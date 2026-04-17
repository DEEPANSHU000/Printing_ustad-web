import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Product = () => {
    const { id } = useParams();
    const { addItem } = useCart();

    const [selectedColor, setSelectedColor] = useState('Pitch Black');
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState("https://lh3.googleusercontent.com/aida-public/AB6AXuBxndXr1Tiq44IXDTrYXlCcx85etOMoB5xfTz0Sl91WBBQ6zf4TwGdOy2vsFGJDHLgAW-9NEmOft__ckYYCAHkW9E2sUJMjA-hSqkU2segQjKbilRJsywoapqKX97dFSp6gY17el2VKeOHpHRpJJIof8qXoqY4lmLuH9RbKDTJ_i6_8Y_qOpwISakMZ-vVPSOWVCQ6seGWJCMv95-MEIKbjZwcGaeCHJkDuS4vHUaYPoHRQW8rYoYQiVdMR5xu_OqXOWPaDRrInIeE");
    const [btnState, setBtnState] = useState('default');

    const swatches = [
        { color: 'Pitch Black', bg: 'bg-black', img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxndXr1Tiq44IXDTrYXlCcx85etOMoB5xfTz0Sl91WBBQ6zf4TwGdOy2vsFGJDHLgAW-9NEmOft__ckYYCAHkW9E2sUJMjA-hSqkU2segQjKbilRJsywoapqKX97dFSp6gY17el2VKeOHpHRpJJIof8qXoqY4lmLuH9RbKDTJ_i6_8Y_qOpwISakMZ-vVPSOWVCQ6seGWJCMv95-MEIKbjZwcGaeCHJkDuS4vHUaYPoHRQW8rYoYQiVdMR5xu_OqXOWPaDRrInIeE" },
        { color: 'Slate Gray', bg: 'bg-neutral-600', img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn8c7TnEy7eoGpF06Gutb_0l9pq7CqQKIlo_f8NauDAvos-IlUNk90TPv2rxscv-NlGlbEKNZO5qQMayBvPbmwtsvNZxuzB2EY1_YXss3W4zu5pEGsxoShZEpSRLXSY5KnNAZga-ZJdFn58-MAmwx3B5XOiw9oNJDeA5A7JKkHEoPB87-FxhIHgsJAWy8cTr7swG2rUPKv0CW1sz1BRoFjx4zwBpCmN4Pt4jJf6gtadoAGiHvCfYH4AG8yZHvbKhemBcem70rPd2Q" }
    ];

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    const handleAddToCart = () => {
        addItem({
            id: id || 'premium-tee-001',
            name: `Premium Studio Tee (${selectedColor})`,
            price: 399.00,
            quantity: quantity,
            image: mainImage,
            attributes: { size: selectedSize, color: selectedColor }
        });
        
        setBtnState('added');
        setTimeout(() => setBtnState('default'), 2000);
    };

    return (
        <div className="bg-[#131313] text-white min-h-screen pt-12 pb-20">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
                    {/* Left: Gallery */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#201f1f] relative group">
                            <img 
                                src={mainImage} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                alt="Product" 
                            />
                            <div className="absolute top-4 right-4">
                                <span className="bg-[#3a3939]/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-white/5">240 GSM</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuAEsYTN3JmJ6RiZ54ob7B_GnyHFw6vAVXe5NQidgujnJtK-b9PrEA5qSf3rbjhonsC1R5uC1qzI01UlxxY4pwft0XQFrIGP2_r2iIlij25Yv2s1LcsdcDF5r2f0SUcmrOwNqaZQoG8F_sP5qTswx4EtVVuu5nlwJIvJhilqoJ38wbN0LYtOKiB9fHdLhYUv87V9pNucitYKE_hqEBDs7xbEecT2kMvizZT1wCt5r9ybYJKksWvZ8IeUk-giHRBjYVhMLfwAvF6W-nQ",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ49C7EDeKrukJuxPsV6ZCMoQQBvNs3iaF-Kcf_tTzYp1evszsjktaNW9wfijH1QnSGCOhOzbF66i-2la5FogvKfEpg6KTxGKLYhmdyqzEiJFkJv9Hp1ULk95e0Ag2heNJ9LtDNhQgHq339b9jpawQpbApA9mKc_wOtYjFpNz0NoqA_q_0nGQOTRxwR2Ou6zIDfOzVOLhWNbkpAuth6ntpeyQ0IUkYL1kQQm6p5IFkq7r5ArFMnstouJDpxSDRQ8Wuj6GExy2mWK8",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuCn8c7TnEy7eoGpF06Gutb_0l9pq7CqQKIlo_f8NauDAvos-IlUNk90TPv2rxscv-NlGlbEKNZO5qQMayBvPbmwtsvNZxuzB2EY1_YXss3W4zu5pEGsxoShZEpSRLXSY5KnNAZga-ZJdFn58-MAmwx3B5XOiw9oNJDeA5A7JKkHEoPB87-FxhIHgsJAWy8cTr7swG2rUPKv0CW1sz1BRoFjx4zwBpCmN4Pt4jJf6gtadoAGiHvCfYH4AG8yZHvbKhemBcem70rPd2Q",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuBoeOF-OgclD-R4fP4ey9x71hqSqGmaKh7e3L82iOEhEtziNbc6bUtBE0ryihdxj6vkwXcvHfy0Lr6LJCTHhOCY7D-4htCf_0w9XthwHowNHZszMBfe2fC80w_bWU4wHAKtMK7rryv5hgHHqiJ_aCDQxxYPVcFWTUMIIZ-5qINiKAABlp9o_JfK0v92SaqkRzETVQl1mQOMYHHmZtHdjG2UG9NFMNHk9OsR29nMVgkRXKVKQ-BVS8u2JOucNfCHrAttpyl7Q99qzgo"
                            ].map((img, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => setMainImage(img)}
                                    className={`aspect-square rounded-lg overflow-hidden bg-[#2a2a2a] cursor-pointer transition-all ${mainImage === img ? 'ring-2 ring-cyan-400' : 'opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt="Product view" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-5 flex flex-col">
                        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#b9cacb] mb-6 font-semibold">
                            <span>Products</span>
                            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                            <span>Apparel</span>
                            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                            <span className="text-[#00dbe9]">T-Shirts</span>
                        </nav>

                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-[#f6f6f6] leading-tight">Premium Studio Tee</h1>
                        
                        <div className="flex items-center gap-6 mb-8">
                            <span className="text-2xl font-light text-[#e5e2e1]">₹399.00</span>
                            <div className="h-4 w-[1px] bg-[#3b494b]"></div>
                            <div className="flex items-center gap-1">
                                <div className="flex text-[#7df4ff]">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <span key={s} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    ))}
                                </div>
                                <span className="text-xs text-[#b9cacb]">(128 Reviews)</span>
                            </div>
                        </div>

                        <p className="text-[#b9cacb] leading-relaxed mb-10 max-w-md">
                            Sustainably sourced, 240GSM heavy-weight cotton. Precision-engineered for durability and a structured, oversized fit that maintains its shape over time.
                        </p>

                        {/* Color Selection */}
                        <div className="mb-8">
                            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#b9cacb] mb-3">Color: <span className="text-white">{selectedColor}</span></p>
                            <div className="flex gap-4">
                                {swatches.map((swatch) => (
                                    <button 
                                        key={swatch.color}
                                        onClick={() => {
                                            setSelectedColor(swatch.color);
                                            setMainImage(swatch.img);
                                        }}
                                        className={`w-8 h-8 rounded-full ${swatch.bg} transition-all ${selectedColor === swatch.color ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#131313]' : 'hover:scale-110'}`}
                                        title={swatch.color}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-[11px] uppercase tracking-widest font-bold text-[#b9cacb]">Select Size</h3>
                                <button className="text-[10px] uppercase tracking-wider underline decoration-cyan-400/40 hover:decoration-cyan-400 transition-all">Size Guide</button>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {sizes.map((size) => (
                                    <button 
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-3 rounded-lg border text-xs font-semibold transition-all ${selectedSize === size ? 'border-cyan-400 bg-cyan-400 text-black' : 'border-[#3b494b] text-white hover:border-white'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity and CTA */}
                        <div className="flex gap-4 mb-12">
                            <div className="flex items-center bg-[#1c1b1b] rounded-xl px-2">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 text-[#b9cacb] hover:text-white"><span className="material-symbols-outlined">remove</span></button>
                                <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="p-2 text-[#b9cacb] hover:text-white"><span className="material-symbols-outlined">add</span></button>
                            </div>
                            <button 
                                onClick={handleAddToCart}
                                className={`flex-1 py-4 rounded-xl font-extrabold tracking-tight transition-all flex items-center justify-center gap-2 shadow-lg ${btnState === 'added' ? 'bg-[#00eefc] text-black' : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98]'}`}
                            >
                                {btnState === 'added' ? (
                                    <>Added! <span className="material-symbols-outlined text-lg">check_circle</span></>
                                ) : (
                                    <>Customize & Order <span className="material-symbols-outlined text-lg">edit_note</span></>
                                )}
                            </button>
                        </div>

                        {/* Specs List */}
                        <div className="space-y-6 pt-10 border-t border-white/10">
                            {[
                                { title: 'Material & Production', desc: '100% Organic combed cotton, 240GSM heavyweight weave. Zero-toxicity sustainable dye process.', icon: 'check_circle' },
                                { title: 'Fit Specs', desc: 'Relaxed silhouette with dropped shoulders and reinforced crewneck collar.', icon: 'straighten' },
                                { title: 'Care Instructions', desc: 'Machine wash cold. Do not tumble dry. Iron inside out to protect custom prints.', icon: 'wash' },
                            ].map((spec, idx) => (
                                <div key={idx} className="group cursor-default">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">{spec.title}</span>
                                        <span className="material-symbols-outlined text-cyan-400">{spec.icon}</span>
                                    </div>
                                    <p className="text-sm text-[#b9cacb]">{spec.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Related Products */}
                <section className="border-t border-white/10 pt-20">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tighter mb-2">Complete the Collection</h2>
                            <p className="text-[#b9cacb] text-sm">Engineered essentials designed for the digital atelier.</p>
                        </div>
                        <Link to="/shop">
                            <button className="text-sm font-bold text-cyan-400 flex items-center gap-2 hover:gap-3 transition-all">
                                Shop All <span className="material-symbols-outlined">arrow_right_alt</span>
                            </button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-black">
                        {[
                            { name: 'Studio Hoodie V1', price: '₹1,265.00', img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrbXyIcSEODyMakV40ASIGCqV4YkMJ_jVd2D17IH6axEjm7Nc4rsZq9I-TK4Ot3i_hhsihe2tJGXk_rHIv1rNqSVqdCDMK01Vp_vxj-7UfrebhWZJw_oOlVa0ra4cZc1a2OsQFZ2nhf4KVkj6xxP_E6tDOflmGi0il2EyQzlJa8okmevtKp9IG0s6KxfxcTd92ZkbBzYqISVySiwRSF-sCx_5GtLnm1FNnYKU56nX4w4B8kt-e7v_kWJedEDp-3j6Of8o7CZgsJkk" },
                            { name: 'Utility Pants', price: '₹899.00', img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfGNJTvir5gwKZV6mCpkVAb0RpzwBK9OeRqn2-YgE-dm07uFqr_Wf6VnLccW2aJ8eMFIUktXsW0OCgO5MVPc0u2rzv05CP1P-JrxmdcsjRYXEy_dLynxyv_mHcGimSekLdbHgERlO44uj4F1VJF9SbuLFr5x7fVHGs5EAe2dJVtbPNn-QYtkLCKA2_y4zzhVGg2Y2ay-W8d2QxLUDmJmw_mSEGZC3r4x71eCE-GcbWvbBhnUNuycBdm-9O76DMu6JFQUllCdpVkZA" },
                            { name: 'Precision Tee - Slate', price: '₹399.00', img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQziId24Q6OlV8HtgNHc8Up3cMNA7QGvWL8NFaigEiwYJI6o9qCGRJx_WyjpzNgMctgJQi5Q8nhGTRCPdd8GFZ1tbjfPiWj-w3hOUme7duzHmCi6ZjB0DZFRWi658NQyaQ9v3xrPJYwPr7LTuAyIX5Y0Bxi6d9_61eAsjrGQl3TIb_pkLrL3-ZgO5M5sJK59KWrz_-ftScibFJOinLnKhx3mM7Xo4QAvvq-vAj3aK5jmsUQQjHzL48snYxJiav2JXpaPcycXxt7Ec" },
                            { name: 'Studio Logo Cap', price: '₹150.00', img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCC0mjprvUaAkSY-8glCnlpXD_FWHcqX3DNEjz6Aqkgs8IEBK9qYhd8FC-pcZhBW93k5QztGV0OB8vTcRb5Wl_1EyXDllzoQnJwJ8P1_GNu-fEeO2bLaNU8he3rGwMPMFNtMenk7yOq04TCamT3zOQT3swKC07rDhLJxCNlY6AzIG-MqO-poL99tXeG8-oFsdW7M1L-Bt0iIURfBM7JgVZm19GZMMBoFrLQLrwT5tKpEYIPEBYqfY7hAFMtxSR5f75wk0KKKU8HNS8" }
                        ].map((p, idx) => (
                            <div key={idx} className="group bg-[#1c1b1b] rounded-xl overflow-hidden hover:shadow-cyan-900/10 hover:shadow-2xl transition-all">
                                <div className="aspect-[3/4] overflow-hidden relative">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={p.img} alt={p.name} />
                                    <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <button className="w-full py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg text-xs font-bold uppercase tracking-wider">Quick Add</button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="text-sm font-bold text-white mb-1">{p.name}</h4>
                                    <div className="flex justify-between items-center text-[#b9cacb]">
                                        <span className="text-xs">{p.price}</span>
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-surface-container-highest"></div>
                                            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Product;
