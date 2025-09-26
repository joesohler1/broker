import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { scrollToTop } from '../utils/scrollUtils';
import './AppSettingsPage.css';

const AppSettingsPage = ({ onLogout, onBack, onNavigateToProfile, onNavigateToAppSettings }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    marketingEmails: false,
    darkMode: false,
    autoSave: true
  });

  const handleBack = () => {
    scrollToTop();
    onBack();
  };

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    // Save to localStorage
    const updatedSettings = {
      ...settings,
      [setting]: !settings[setting]
    };
    localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
  };

  return (
    <div className="app-settings-page">
      <Navbar 
        onLogout={onLogout} 
        onNavigateToDashboard={handleBack}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToAppSettings={onNavigateToAppSettings}
      />
      
      <div className="settings-content">
        <div className="settings-header">
          <button className="back-button" onClick={handleBack}>
            ← Back to Dashboard
          </button>
          <div className="page-title">
            <h1>App Settings</h1>
            <p>Customize your app experience and preferences</p>
          </div>
        </div>

        <div className="settings-container">
          <div className="settings-section">
            <div className="section-header">
              <h2>🔔 Notifications</h2>
              <p>Choose how you want to be notified about updates and activities</p>
            </div>

            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Email Notifications</h3>
                  <p>Receive important updates via email</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleSettingChange('emailNotifications')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Push Notifications</h3>
                  <p>Get instant notifications in your browser</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={() => handleSettingChange('pushNotifications')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>SMS Notifications</h3>
                  <p>Receive text messages for urgent updates</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={() => handleSettingChange('smsNotifications')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Marketing Emails</h3>
                  <p>Receive tips, updates, and promotional content</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.marketingEmails}
                    onChange={() => handleSettingChange('marketingEmails')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-header">
              <h2>🎨 Appearance & Behavior</h2>
              <p>Personalize how the app looks and feels</p>
            </div>

            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Dark Mode</h3>
                  <p>Use dark colors to reduce eye strain</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={() => handleSettingChange('darkMode')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Auto-Save</h3>
                  <p>Automatically save your work as you type</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={() => handleSettingChange('autoSave')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-header">
              <h2>📊 Data & Privacy</h2>
              <p>Control your data and privacy preferences</p>
            </div>

            <div className="privacy-placeholder">
              <div className="placeholder-content">
                <div className="placeholder-icon">🔒</div>
                <h3>Advanced Privacy Controls Coming Soon</h3>
                <p>
                  We're working on comprehensive privacy and data management tools. 
                  These features will be available in a future update.
                </p>
                <div className="planned-features">
                  <h4>Planned Features:</h4>
                  <ul>
                    <li>Data Export & Download</li>
                    <li>Account Deletion</li>
                    <li>Privacy Dashboard</li>
                    <li>Cookie Preferences</li>
                    <li>Data Sharing Controls</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSettingsPage;