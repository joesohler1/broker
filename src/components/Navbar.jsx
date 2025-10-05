import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ onLogout, onNavigateToDashboard, onNavigateToProfile, onNavigateToAppSettings }) => {
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const handleSettingsClick = () => {
    setShowSettingsDropdown(!showSettingsDropdown);
  };

  const handleProfileClick = () => {
    setShowSettingsDropdown(false);
    if (onNavigateToProfile) {
      onNavigateToProfile();
    }
  };

  const handleAppSettingsClick = () => {
    setShowSettingsDropdown(false);
    if (onNavigateToAppSettings) {
      onNavigateToAppSettings();
    }
  };

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
      
      <div className="navbar-center">
        <h2 className="page-title">Dashboard</h2>
      </div>
      
      <div className="navbar-actions">
        <div className="settings-dropdown">
          <button 
            className="settings-button" 
            onClick={handleSettingsClick}
            aria-label="Settings"
          >
            Settings
          </button>
          
          {showSettingsDropdown && (
            <div className="settings-dropdown-menu">
              <button 
                className="dropdown-item" 
                onClick={handleProfileClick}
              >
                👤 Profile Settings
              </button>
              <button 
                className="dropdown-item" 
                onClick={handleAppSettingsClick}
              >
                🔧 App Settings
              </button>
            </div>
          )}
        </div>
        
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
