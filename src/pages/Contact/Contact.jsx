import React from 'react';
import './Contact.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

export default function Contact(){
  return (
    <>
      <Breadcrumb title="Contact" />
      <div className="auth-page container">
        <div className="contact-card">
          <h2>Contact Us</h2>
          <p className="subtitle">We’d love to hear from you</p>
          <form className="contact-form">
            <label>Name</label><input placeholder="Your name" />
            <label>Email</label><input placeholder="Your email" />
            <label>Message</label><textarea placeholder="Type your message" rows="6" />
            <div style={{textAlign:'center', marginTop:12}}>
              <button className="btn primary">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
