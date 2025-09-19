// src/pages/Cart/Cart.jsx
import React from 'react';
import './Cart.css';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const calculateSubtotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = cart.length > 0 ? 3.99 : 0;
  const tax = cart.length > 0 ? 2.00 : 0;
  const total = calculateSubtotal() + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add items to your cart to purchase them</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Basket <span className="cart-count">{cart.length} items</span></h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="price">${item.price.toFixed(2)} / {item.unit}</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} disabled={item.quantity <= 1}>-</button>
                  <span>{item.quantity} {item.unit}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <button className="remove-item" onClick={() => removeFromCart(item.id)}>
                <span role="img" aria-label="Remove">🗑️</span>
              </button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Order summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>${calculateSubtotal().toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
          <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button className="checkout-btn" onClick={() => window.location.href='/payment'}>Continue to payment &rarr;</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;