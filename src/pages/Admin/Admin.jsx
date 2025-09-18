import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

export default function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn primary">
          Logout
        </button>
      </div>
      <div className="admin-content">
        <p>Welcome, {user?.username}!</p>
        <p>This is the admin dashboard. More admin features coming soon.</p>
      </div>
    </div>
  );
}
