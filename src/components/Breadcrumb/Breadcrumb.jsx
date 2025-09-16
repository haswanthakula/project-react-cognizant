import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

export default function Breadcrumb({ title = 'Page' }) {
  return (
    <div className="breadcrumb-row">
      <div className="container breadcrumb-inner">
        <div className="page-title">{title}</div>
        <div className="crumbs">
          <Link to="/">Home</Link>
          <span className="sep">»</span>
          <span className="current">{title}</span>
        </div>
      </div>
    </div>
  );
}
