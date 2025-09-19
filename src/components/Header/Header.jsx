import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // close dropdown on route change
    setOpen(false);
  }, [location]);

  // only needed when dropdown is present (i.e. when user is NOT logged in)
  useEffect(() => {
    if (user) return; // no dropdown behavior for logged-in
    function onDocClick(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [user]);

  function handleCartClick() {
    if (!user) navigate('/login');
    else navigate('/cart');
  }

  function handleWishlistClick() {
    if (!user) navigate('/login');
    else navigate('/wishlist');
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  // If logged in, clicking account should go straight to profile (no dropdown)
  function handleAccountClick() {
    if (user) {
      navigate(`/profile/${user.username}`);
    } else {
      setOpen(v => !v);
    }
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="left">
          <Link to="/" className="logo" aria-label="Home">
            <svg className="logo-icon" width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="7" width="18" height="13" rx="2" fill="#5e66e7"/>
              <path d="M3 7l9-4 9 4" stroke="#fff" strokeWidth="0.8" />
            </svg>
            <span className="brand">Shopify</span>
          </Link>
        </div>

        <nav className="center-nav">
          <Link to="/deals" className="nav-link">Deals of the Day</Link>
          <Link to="/new" className="nav-link">New Arrivals</Link>
          <Link to="/products" className="nav-link">Shop</Link>
        </nav>

        <div className="right" ref={containerRef}>
          <button className="icon-btn with-label" title="Wishlist" onClick={handleWishlistClick} aria-label="Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="#374151" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="icon-label">Wishlist</span>
          </button>

          <button className="icon-btn with-label" title="Cart" onClick={handleCartClick} aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.44A1 1 0 0 0 9.1 18h8.45a1 1 0 0 0 .92-.62L22 8H6.21" fill="none" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="icon-label">Cart</span>
          </button>

          <div className="account-wrap">
            <div className="account">
              <button
                // add class 'direct' when user exists so css can hide chevron
                className={`account-button ${user ? 'direct' : ''}`}
                aria-haspopup={!user}
                aria-expanded={open}
                onClick={handleAccountClick}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <circle cx="12" cy="8" r="3.2" fill="#374151" />
                  <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" fill="#374151" />
                </svg>

                <span className="account-name">{user ? user.username : 'Account'}</span>

                <svg className={`chev ${open ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" aria-hidden>
                  <path d="M6 9l6 6 6-6" stroke="#374151" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Render dropdown only when NOT logged in */}
              {!user && (
                <div className={`dropdown ${open ? 'show' : ''}`} role="menu" aria-hidden={!open}>
                  <Link className="drop-link" to="/login" onClick={() => setOpen(false)}>Login</Link>
                  <Link className="drop-link" to="/register" onClick={() => setOpen(false)}>Register</Link>
                </div>
              )}
            </div>

            {/* Logout shown to the right of account when logged in */}
            {user ? (
              <button className="btn-logout" onClick={handleLogout} title="Logout">Logout</button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
