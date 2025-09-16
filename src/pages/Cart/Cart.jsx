import React from 'react';
import './Cart.css';

export default function Cart(){
  return (
    <div className="container" style={{ paddingTop: 36 }}>
      <div style={{ maxWidth: 900, margin: '24px auto', background:'#fff', padding:28, borderRadius:12, boxShadow:'0 8px 24px rgba(16,24,40,0.06)' }}>
        <h2>Your Cart</h2>
        <p>This is a placeholder cart. In this demo, unauthenticated users are redirected to login when clicking cart.</p>
      </div>
    </div>
  );
}
