import React from 'react';
import './Topbar.css';

export default function Topbar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className="topbar">
      <h1 className="topbar-title">Dashboard</h1>
      <div className="topbar-actions">
        <span
          className="material-symbols-outlined account-icon"
          onClick={handleLogout}
          title="Logout"
        >
          account_circle
        </span>
      </div>
    </header>
  );
}
