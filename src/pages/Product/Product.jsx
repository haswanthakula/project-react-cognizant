import React from 'react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Product.css';

export default function ProductPage() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleAddToCart(product) {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
  }

  function handleAddToWishlist(product) {
    if (!user) {
      navigate('/login');
      return;
    }
    addToWishlist(product);
  }

  return (
    <div className="product-list-container">
      <h1>Products</h1>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h2>{product.name}</h2>
              <p className="product-price">${product.price} / {product.unit}</p>
              <p className="product-desc">{product.description}</p>
              <div className="product-actions">
                <button className="btn" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                <button className="btn outline" onClick={() => handleAddToWishlist(product)}>Add to Wishlist</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
