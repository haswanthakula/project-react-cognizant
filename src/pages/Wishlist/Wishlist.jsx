// src/pages/Wishlist/Wishlist.jsx
import React, { useContext } from 'react';
import { WishlistContext } from '../../context/WishlistContext';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useContext(WishlistContext);

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
      <h1>Your Wishlist</h1>
      <div className="wishlist-items">
        {wishlist.map((product) => (
          <div key={product.id} className="wishlist-item">
            <div className="wishlist-item-image">
              <img src={product.image} alt={product.title} />
            </div>
            <div className="wishlist-item-details">
              <h3 className="wishlist-item-title">{product.title}</h3>
              <p className="wishlist-item-price">${product.price.toFixed(2)}</p>
              <div className="wishlist-item-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => removeFromWishlist(product.id)}
                >
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