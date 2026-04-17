import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id1 = ''; 
        let id2 = '';
        for(let i=0; i<4; i++) {
            id1 += chars.charAt(Math.floor(Math.random() * chars.length));
            id2 += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setOrderId(`PU-${id1}-${id2}`);
    }, []);

    return (
        <div className="bg-[#131313] text-white min-h-screen flex items-center justify-center p-6">
            <div className="max-w-[600px] w-full bg-[#2a2a2a] rounded-3xl border border-white/5 p-12 text-center shadow-2xl relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-400/10 blur-[80px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-cyan-400 rounded-full flex items-center justify-center text-black mb-8 shadow-[0_0_30px_rgba(0,238,252,0.3)]">
                        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    
                    <h1 className="text-4xl font-extrabold mb-4">Order Confirmed!</h1>
                    <p className="text-[#b9cacb] text-lg mb-8 leading-relaxed max-w-[400px]">
                        Your custom prints are heading to the studio. We've sent an email with your unique order ID and tracking details.
                    </p>
                    
                    <div className="bg-[#1c1b1b] p-4 rounded-xl border border-white/5 mb-8 w-full">
                        <p className="text-sm text-[#b9cacb]">Order Number</p>
                        <p className="font-mono text-xl font-bold text-[#f6f6f6] tracking-widest mt-1">{orderId}</p>
                    </div>
                    
                    <Link to="/" className="w-full bg-[#f6f6f6] text-black font-extrabold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl flex items-center justify-center">
                        Return to Studio
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Success;
