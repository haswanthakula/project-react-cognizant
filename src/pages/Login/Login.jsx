import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';
import Notification from '../../components/Notification/Notification';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

const API = 'http://localhost:3001';

export default function Login() {
  const [identifier, setIdentifier] = useState(''); // email or username
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [notif, setNotif] = useState({ message: '', type: 'info', visible: false });
  const navigate = useNavigate();
  const { login } = useAuth();

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function validate() {
    const e = {};
    if (!identifier.trim()) e.identifier = 'Email or username is required';
    if (!password) e.password = 'Password is required';
    return e;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErrors({});
    const ev = validate();
    if (Object.keys(ev).length) {
      setErrors(ev);
      return;
    }

    try {
      const idVal = identifier.trim();
      const pwd = password;
      let queryUrl;

      if (isEmail(idVal)) {
        const email = idVal.toLowerCase();
        queryUrl = `${API}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(pwd)}`;
      } else {
        const username = idVal.toLowerCase();
        queryUrl = `${API}/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(pwd)}`;
      }

      const res = await fetch(queryUrl);
      const data = await res.json();

      if (data.length === 0) {
        setNotif({ message: 'Invalid credentials', type: 'error', visible: true });
        setTimeout(() => setNotif(v => ({ ...v, visible: false })), 1200);
        return;
      }

      const u = data[0];
      login({ id: u.id, username: u.username, email: u.email });
      setNotif({ message: `Welcome back, ${u.username}`, type: 'success', visible: true });

      // short pause so user sees the toast then navigate
      setTimeout(() => {
        setNotif(v => ({ ...v, visible: false }));
        navigate(`/user/${u.username}`);
      }, 700);
    } catch (err) {
      console.error(err);
      setNotif({ message: 'Login failed. Try again.', type: 'error', visible: true });
      setTimeout(() => setNotif(v => ({ ...v, visible: false })), 1200);
    }
  }

  return (
    <>
      <Breadcrumb title="Login" />
      <div className="auth-page container">
        <div className="auth-card">
          <h2 className="title">Log <span>In</span></h2>
          <p className="subtitle">Sign in with your email or username</p>

          <form className="auth-form" onSubmit={onSubmit} noValidate>
            <label>Email or Username*</label>
            <input
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="Email or username"
              type="text"
              autoComplete="username"
            />
            {errors.identifier && <div className="field-err">{errors.identifier}</div>}

            <label>Password*</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              type="password"
              autoComplete="current-password"
            />
            {errors.password && <div className="field-err">{errors.password}</div>}

            <div className="auth-actions" style={{ marginTop: 12 }}>
              <button className="btn primary" type="submit">Login</button>
              <a className="link small" href="/register">Register</a>
            </div>
          </form>
        </div>
      </div>

      <Notification message={notif.message} type={notif.type} visible={notif.visible} />
    </>
  );
}
