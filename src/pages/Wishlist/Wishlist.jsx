import React from 'react';
import './Wishlist.css';

export default function Wishlist(){
  return (
    <div className="container" style={{ paddingTop: 36 }}>
      <div style={{ maxWidth: 900, margin: '24px auto', background:'#fff', padding:28, borderRadius:12, boxShadow:'0 8px 24px rgba(16,24,40,0.06)' }}>
        <h2>Your Wishlist</h2>
        <p>Items you saved will appear here. (Placeholder page)</p>
      </div>
    </div>
  );
}
