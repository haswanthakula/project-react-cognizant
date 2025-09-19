import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Contact from './pages/Contact/Contact';
import User from './pages/User/User';
import Profile from './pages/Profile/Profile';
import Cart from './pages/Cart/Cart';
import Wishlist from './pages/Wishlist/Wishlist';
import Admin from './pages/Admin/Admin';
import ProductPage from './pages/Product/Product';
import Payment from './pages/Payment/Payment';

// Protected Route component
function AdminRoute({ children }) {
  const { user } = useAuth();
  return user?.isAdmin ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const location = useLocation();

  // hide header on auth pages and admin
  const noHeaderRoutes = ['/login', '/register', '/contact', '/contactus', '/admin'];
  const hideHeader = noHeaderRoutes.some(p => location.pathname.startsWith(p));

  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            {!hideHeader && <Header />}
            <main className={hideHeader ? 'main no-header' : 'main with-header'}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/contactus" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />

                {/* Admin route */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  } 
                />

                {/* user landing page after login */}
                <Route path="/user/:username" element={<User />} />
                {/* profile management */}
                <Route path="/profile/:username" element={<Profile />} />

                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            {!hideHeader && <Footer />}
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
