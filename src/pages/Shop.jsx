import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Shop = () => {
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [sortBy, setSortBy] = useState('default');

  const categories = [
    { name: 'All Products', value: 'All' },
    { name: 'T-Shirts & Hoodies', value: 'Apparel' },
    { name: 'Mugs & Drinkware', value: 'Mugs' },
    { name: 'Water Bottles', value: 'Bottles' },
    { name: 'Visiting Cards', value: 'Stationery' },
    { name: 'Diaries & Notebooks', value: 'Diaries' },
    { name: 'Photo Frames', value: 'Frames' },
    { name: 'Caps & Accessories', value: 'Accessories' },
    { name: 'Calendars', value: 'Calendars' },
    { name: 'Corporate Kits', value: 'Corporate' },
  ];

  const allProducts = [
    { id:'rn-tshirt', name:'Round Neck T-Shirts', price:399, minQty:1, cat:'Apparel', img:'https://img-srv.arcprint.com/adpsSTG/category/1774075905173_290.jpg/full/400,400/0/default.webp' },
    { id:'polo-tshirt', name:'Polo T-Shirts', price:650, minQty:1, cat:'Apparel', img:'https://img-srv.arcprint.com/adpsSTG/category/1774075758039_237.jpg/full/400,400/0/default.webp' },
    { id:'custom-hoodie', name:'Custom Hoodies', price:1265, minQty:1, cat:'Apparel', img:'https://img-srv.arcprint.com/adpsSTG/category/1733319874776_931.jpg/full/400,400/0/default.webp' },
    { id:'custom-caps', name:'Custom Caps', price:150, minQty:10, cat:'Accessories', img:'https://img-srv.arcprint.com/adpsSTG/category/1687873327336_970.jpg/full/400,400/0/default.webp' },
    { id:'photo-cup', name:'Photo Cup', price:230, minQty:1, cat:'Mugs', img:'https://img-srv.arcprint.com/adpsSTG/category/1687877530935_150.jpg/full/400,400/0/default.webp' },
    { id:'magic-mug', name:'Magic Mugs', price:350, minQty:1, cat:'Mugs', img:'https://img-srv.arcprint.com/adpsSTG/category/1765530043357_329.jpg/full/400,400/0/default.webp' },
    { id:'led-bottle', name:'LED Temp Water Bottle', price:549, minQty:1, cat:'Bottles', img:'https://img-srv.arcprint.com/adpsSTG/category/water-bottle-in-type-4.jpg/full/400,400/0/default.webp' },
    { id:'carabiner-bottle', name:'Carabiner Water Bottles', price:325, minQty:1, cat:'Bottles', img:'https://img-srv.arcprint.com/adpsSTG/category/1681901382671_191.jpg/full/400,400/0/default.webp' },
    { id:'acrylic-frame', name:'Acrylic Photo Frames', price:450, minQty:1, cat:'Frames', img:'https://img-srv.arcprint.com/adpsSTG/category/1687872720138_892.jpg/full/400,400/0/default.webp' },
    { id:'wood-frame', name:'Wooden Photo Frames', price:800, minQty:1, cat:'Frames', img:'https://img-srv.arcprint.com/adpsSTG/category/1687874765305_638.jpg/full/400,400/0/default.webp' },
    { id:'led-frame', name:'LED Clip On Frame', price:850, minQty:1, cat:'Frames', img:'https://img-srv.arcprint.com/adpsSTG/category/1687875115423_350.jpg/full/400,400/0/default.webp' },
    { id:'acrylic-clock', name:'Acrylic Clocks', price:999, minQty:1, cat:'Frames', img:'https://img-srv.arcprint.com/adpsSTG/category/1687872653926_751.jpg/full/400,400/0/default.webp' },
    { id:'pen-gold', name:'Pen with Golden Touch', price:58, minQty:1, cat:'Stationery', img:'https://img-srv.arcprint.com/adpsSTG/category/1678351724818_367.jpg/full/400,400/0/default.webp' },
    { id:'keychain', name:'Keychains', price:120, minQty:1, cat:'Accessories', img:'https://img-srv.arcprint.com/adpsSTG/category/1687874976160_151.jpg/full/400,400/0/default.webp' },
    { id:'luxury-diary', name:'Luxury Diary & Pen Set', price:675, minQty:1, cat:'Diaries', img:'https://img-srv.arcprint.com/adpsSTG/category/1725621427039_318.jpg/full/400,400/0/default.webp' },
    { id:'leather-diary', name:'Custom Leather Diary', price:230, minQty:1, cat:'Diaries', img:'https://img-srv.arcprint.com/adpsSTG/category/1720882534503_377.jpg/full/400,400/0/default.webp' },
    { id:'exec-diary', name:'Executive Diary', price:375, minQty:1, cat:'Diaries', img:'https://img-srv.arcprint.com/adpsSTG/category/1687873546838_915.jpg/full/400,400/0/default.webp' },
    { id:'desk-cal', name:'Desk Calendars', price:270, minQty:1, cat:'Calendars', img:'https://img-srv.arcprint.com/adpsSTG/category/1761832333077_818.jpg/full/400,400/0/default.webp' },
    { id:'wall-cal', name:'Wall Calendars', price:20, minQty:1, cat:'Calendars', img:'https://img-srv.arcprint.com/adpsSTG/category/1761832262857_830.jpg/full/400,400/0/default.webp' },
    { id:'mousepad-cal', name:'Mouse Pad Calendars', price:170, minQty:1, cat:'Calendars', img:'https://img-srv.arcprint.com/adpsSTG/category/1761832422386_191.jpg/full/400,400/0/default.webp' },
    { id:'welcome-kit', name:'Office Welcome Kit', price:700, minQty:1, cat:'Corporate', img:'https://img-srv.arcprint.com/adpsSTG/category/1687873459441_632.jpg/full/400,400/0/default.webp' },
    { id:'fusion-combo', name:'Fusion Combo', price:1475, minQty:1, cat:'Corporate', img:'https://img-srv.arcprint.com/adpsSTG/category/1725621483382_603.jpg/full/400,400/0/default.webp' },
    { id:'new-hire-box', name:'New Hire Swag Box', price:875, minQty:1, cat:'Corporate', img:'https://img-srv.arcprint.com/adpsSTG/category/1725621504589_922.jpg/full/400,400/0/default.webp' },
    { id:'drinkware-combo', name:'3 in 1 Drinkware Combo', price:1150, minQty:1, cat:'Corporate', img:'https://img-srv.arcprint.com/adpsSTG/category/1725621346185_454.jpg/full/400,400/0/default.webp' },
  ];

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(p => {
      const matchCat = activeCategory === 'All' || p.cat === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchPrice = p.price >= priceRange.min && p.price <= priceRange.max;
      return matchCat && matchSearch && matchPrice;
    });

    if (sortBy === 'low-high') result.sort((a,b) => a.price - b.price);
    else if (sortBy === 'high-low') result.sort((a,b) => b.price - a.price);
    else if (sortBy === 'name') result.sort((a,b) => a.name.localeCompare(b.name));

    return result;
  }, [searchQuery, activeCategory, priceRange, sortBy]);

  const resetAll = () => {
    setSearchQuery('');
    setActiveCategory('All');
    setPriceRange({ min: 0, max: Infinity });
    setSortBy('default');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <nav className="text-xs text-gray-500 flex items-center gap-1">
          <Link to="/" className="hover:text-purple-600">Home</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-gray-800 font-medium">All Products</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-6 pb-16">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wider">Categories</h3>
              <ul className="space-y-2 text-sm">
                {categories.map(cat => (
                  <li key={cat.value}>
                    <button 
                      onClick={() => setActiveCategory(cat.value)}
                      className={`w-full text-left transition-colors hover:text-purple-600 ${activeCategory === cat.value ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wider">Price Range</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  { label: 'Under ₹100', min: 0, max: 100 },
                  { label: '₹100 – ₹500', min: 100, max: 500 },
                  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
                  { label: '₹1,000+', min: 1000, max: Infinity },
                ].map((range, idx) => (
                  <li key={idx}>
                    <button 
                      onClick={() => setPriceRange({ min: range.min, max: range.max })}
                      className={`hover:text-purple-600 w-full text-left transition-colors ${priceRange.min === range.min && priceRange.max === range.max ? 'text-purple-600 font-semibold' : ''}`}
                    >
                      {range.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Custom Products</h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredProducts.length === 0 ? 'No products found' : `Showing ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
               {/* Search in main content for mobile simplicity or keep desktop search */}
              <div className="relative lg:hidden">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..." 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-purple-500"
              >
                <option value="default">Sort by: Featured</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(p => (
                <div key={p.id} className="product-card bg-white rounded-3xl border border-purple-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
                  <div className="relative overflow-hidden aspect-square bg-purple-50">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    {p.minQty > 1 && (
                      <span className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">Min. {p.minQty}</span>
                    )}
                    <div className="card-overlay absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-2 flex gap-2">
                      <button 
                        onClick={() => addItem({ ...p, quantity: 1, image: p.img, attributes: { size: 'Default' } })}
                        className="flex-1 bg-purple-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span> Add
                      </button>
                      <Link to={`/product/${p.id}`} className="flex-1 border border-purple-600 text-purple-600 text-xs font-semibold py-2 rounded-lg text-center hover:bg-purple-50 transition-colors">
                        Customize
                      </Link>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-800 leading-tight mb-1 line-clamp-2">{p.name}</h3>
                    <p className="text-purple-700 font-bold text-sm">₹{p.price.toLocaleString('en-IN')}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Min. qty: {p.minQty}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">Try a different search or category</p>
              <button 
                onClick={resetAll}
                className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Show All Products
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
