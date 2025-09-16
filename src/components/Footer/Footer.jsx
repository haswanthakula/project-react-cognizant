import React from 'react';
import './Footer.css';

export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="col brand-col">
          <div className="brand-row">
            <div className="logoSquare" />
            <div>
              <div className="footer-brand">Shopify</div>
              <div className="footer-sub">Empowering merchants with great tooling.</div>
            </div>
          </div>
        </div>

        <div className="col links-col">
          <h4>Explore</h4>
          <nav>
            <a href="/">Homepage</a>
            <a href="/deals">Deals</a>
            <a href="/new">New Arrivals</a>
            <a href="/shop">Shop</a>
          </nav>
        </div>

        <div className="col contact-col">
          <h4>Contact</h4>
          <div className="contact-item">
            <strong>Email:</strong> <a href="mailto:support@example.com">support@example.com</a>
          </div>
          <div className="contact-item">
            <strong>Phone:</strong> <a href="tel:+11234567890">+1 (123) 456-7890</a>
          </div>
          <div className="socials">
            <a aria-label="Facebook" href="https://facebook.com" target="_blank" rel="noreferrer">Fb</a>
            <a aria-label="X" href="https://twitter.com" target="_blank" rel="noreferrer">X</a>
            <a aria-label="LinkedIn" href="https://linkedin.com" target="_blank" rel="noreferrer">In</a>
            <a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noreferrer">Ig</a>
          </div>
        </div>
      </div>

      <div className="copyright">
        © {new Date().getFullYear()} Shopify-like demo. All rights reserved. · Built with care.
      </div>
    </footer>
  );
}
