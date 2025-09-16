import React from 'react';
import './Notification.css';

/**
 * Props:
 * - message: string
 * - type: 'success'|'error'|'info'
 * - visible: boolean
 */
export default function Notification({ message = '', type = 'info', visible = false }) {
  return (
    <div className={`notif-wrap ${visible ? 'show' : ''}`} aria-live="polite">
      <div className={`notif ${type}`}>
        <div className="notif-body">{message}</div>
      </div>
    </div>
  );
}
