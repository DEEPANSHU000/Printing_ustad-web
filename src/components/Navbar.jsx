import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm">
      {/* Top Bar */}
      <div className="bg-purple-950 text-purple-100 text-xs py-2 px-4 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden md:block">🇮🇳 India's Trusted Custom Printing Platform</span>
          <div className="flex items-center gap-6">
            <a href="tel:9876543210" className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
              <span className="material-symbols-outlined text-sm">call</span> 98765 43210
            </a>
            <a href="mailto:support@printingustad.com" className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
              <span className="material-symbols-outlined text-sm">mail</span> support@printingustad.com
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="/logo.png" alt="Printing Ustad" className="h-10 w-auto object-contain" />
          <span className="font-bold text-xl text-gray-900 hidden sm:block">Printing Ustad</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-auto">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for products..." 
              className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600">
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
          </div>
        </div>

        {/* Nav Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link to="/info" className="hidden md:flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
            <span className="material-symbols-outlined text-xl">person</span>
            <span className="hidden lg:block">Login</span>
          </Link>
          <Link to="/cart" className="relative flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
            <span className="material-symbols-outlined text-xl">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
            <span className="hidden lg:block">Cart</span>
          </Link>
        </div>
      </div>

      {/* Category Nav */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-6 overflow-x-auto py-2 text-sm font-medium text-gray-700 pill-scroll">
            <Link to="/shop" className="whitespace-nowrap hover:text-purple-600 transition-colors">All Products</Link>
            <Link to="/shop" className="whitespace-nowrap hover:text-purple-600 transition-colors">T-Shirts & Apparel</Link>
            <Link to="/shop" className="whitespace-nowrap hover:text-purple-600 transition-colors">Mugs & Bottles</Link>
            <Link to="/shop" className="whitespace-nowrap hover:text-purple-600 transition-colors">Visiting Cards</Link>
            <Link to="/shop" className="whitespace-nowrap hover:text-purple-600 transition-colors">Diaries & Notebooks</Link>
            <Link to="/shop" className="whitespace-nowrap hover:text-purple-600 transition-colors">Stickers & Labels</Link>
            <Link to="/shop" className="whitespace-nowrap hover:text-purple-600 transition-colors">Photo Gifts</Link>
            <Link to="/shop" className="whitespace-nowrap hover:text-purple-600 transition-colors">Calendars</Link>
            <Link to="/shop" className="whitespace-nowrap hover:text-purple-600 transition-colors">Corporate Kits</Link>
            <Link to="/customizer" className="whitespace-nowrap text-purple-600 font-semibold hover:underline transition-colors">✦ Design Studio</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
