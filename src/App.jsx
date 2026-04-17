import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Customizer from './pages/Customizer';
import Cart from './pages/Cart';
import Success from './pages/Success';
import Info from './pages/Info';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/customizer" element={<Customizer />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/success" element={<Success />} />
              <Route path="/info" element={<Info />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
