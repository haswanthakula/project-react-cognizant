import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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



export default function App() {
  const location = useLocation();

  // hide header on auth pages (you asked earlier to remove header here)
  const noHeaderRoutes = ['/login', '/register', '/contact', '/contactus'];
  const hideHeader = noHeaderRoutes.some(p => location.pathname.startsWith(p));

  return (
    <AuthProvider>
      {!hideHeader && <Header />}
      <main className={hideHeader ? 'main no-header' : 'main with-header'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contactus" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* user landing page after login */}
          <Route path="/user/:username" element={<User />} />
          {/* profile management */}
          <Route path="/profile/:username" element={<Profile />} />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
}
