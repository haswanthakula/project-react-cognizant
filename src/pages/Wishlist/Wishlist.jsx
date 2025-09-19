// src/pages/Wishlist/Wishlist.jsx
import React from 'react';
import './Wishlist.css';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user, login } = useAuth();

  function handleAddToCart(product) {
    if (!user) return;
    addToCart(product);
    removeFromWishlist(product.id);
    // Update user.cart in db.json (simulate API)
    fetch(`/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart: [...(user.cart || []), { ...product, quantity: 1 }] })
    }).then(() => {
      login({ ...user, cart: [...(user.cart || []), { ...product, quantity: 1 }] });
    });
  }

  function handleRemoveFromWishlist(id) {
    if (!user) return;
    removeFromWishlist(id);
    // Update user.wishlist in db.json (simulate API)
    fetch(`/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wishlist: (wishlist.filter(item => item.id !== id)) })
    }).then(() => {
      login({ ...user, wishlist: wishlist.filter(item => item.id !== id) });
    });
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-container">
        <div className="empty-wishlist">
          <h2>Your wishlist is empty</h2>
          <p>Add items you love to your wishlist to save them for later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">
        Your Wishlist <span className="wishlist-count">{wishlist.length} items</span>
      </h1>
      <div className="wishlist-items">
        {wishlist.map((product) => (
          <div key={product.id} className="wishlist-item">
            <div className="wishlist-item-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="wishlist-item-details">
              <h3 className="wishlist-item-title">{product.name}</h3>
              <p className="wishlist-item-price">${product.price?.toFixed(2)} / {product.unit}</p>
              <p className="wishlist-item-desc">{product.description}</p>
              <div className="wishlist-item-actions">
                <button className="btn btn-primary" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
                <button className="btn btn-outline" onClick={() => handleRemoveFromWishlist(product.id)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;