import React from 'react';
import './Navbar.css';

const Navbar = ({ onLogout, onNavigateToDashboard }) => {
  return (
    <nav className="navbar">
      <div 
        className="navbar-brand" 
        onClick={onNavigateToDashboard}
        style={{ cursor: onNavigateToDashboard ? 'pointer' : 'default' }}
      >
        <h1>FixBo</h1>
        <p className="tagline">Let's fix it.</p>
      </div>
      <button className="logout-button" onClick={onLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
