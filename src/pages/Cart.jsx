import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, updateQuantity, removeItem, clearCart } = useCart();
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 50 : 0;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    const handleCheckout = () => {
        if (cart.length === 0) return;
        
        setIsCheckingOut(true);
        // Simulate processing time
        setTimeout(() => {
            clearCart();
            setIsCheckingOut(false);
            navigate('/success');
        }, 1000);
    };

    return (
        <div className="bg-[#131313] text-white min-h-screen pt-12 pb-20">
            <div className="max-w-[1200px] mx-auto px-6">
                <h1 className="text-4xl font-extrabold tracking-tighter mb-10">Studio Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-[#b9cacb] opacity-50">
                                <span className="material-symbols-outlined text-6xl mb-4">shopping_basket</span>
                                <p className="text-lg">Your cart is currently empty.</p>
                                <Link to="/shop" className="mt-6 text-[#00eefc] font-bold hover:underline">Start designing products</Link>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.uniqueId} className="flex gap-6 p-6 bg-[#201f1f] rounded-2xl border border-white/5 group transition-all hover:border-white/10">
                                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/20 flex-shrink-0">
                                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-lg text-[#f6f6f6]">{item.name}</h3>
                                                <button onClick={() => removeItem(item.uniqueId)} className="text-[#b9cacb] hover:text-red-400 transition-colors">
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {item.attributes && Object.entries(item.attributes).map(([key, val]) => (
                                                    <span key={key} className="text-[10px] uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded text-[#b9cacb] font-bold">
                                                        {key}: {val}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex items-center bg-black/40 rounded-lg px-2 py-1">
                                                <button onClick={() => updateQuantity(item.uniqueId, -1)} className="p-1 hover:text-white transition-colors">
                                                    <span className="material-symbols-outlined text-sm">remove</span>
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.uniqueId, 1)} className="p-1 hover:text-white transition-colors">
                                                    <span className="material-symbols-outlined text-sm">add</span>
                                                </button>
                                            </div>
                                            <span className="font-extrabold text-[#00eefc] text-lg">₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-white/5 sticky top-24 shadow-xl shadow-black/50">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm text-[#b9cacb]">
                                    <span>Subtotal</span>
                                    <span className="text-white">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-[#b9cacb]">
                                    <span>Shipping</span>
                                    <span className="text-white">₹{shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-[#b9cacb]">
                                    <span>Tax (GST 18%)</span>
                                    <span className="text-white">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="w-full h-[1px] bg-white/10 my-2"></div>
                                <div className="flex justify-between items-center font-bold text-lg mb-4">
                                    <span>Total</span>
                                    <span className="text-[#00eefc]">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                            <button 
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || isCheckingOut}
                                className={`w-full py-4 rounded-xl font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg ${cart.length === 0 || isCheckingOut ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-[#f6f6f6] text-black hover:scale-[1.02] active:scale-[0.98]'}`}
                            >
                                {isCheckingOut ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
                                        Processing...
                                    </>
                                ) : 'Proceed to Checkout'}
                            </button>
                            <div className="mt-6 flex items-center justify-center gap-4 grayscale opacity-50">
                                <span className="material-symbols-outlined">payments</span>
                                <span className="material-symbols-outlined">credit_card</span>
                                <span className="material-symbols-outlined">account_balance</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
