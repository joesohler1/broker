import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { scrollToTop } from '../utils/scrollUtils';
import './ProfileSettingsPage.css';

const ProfileSettingsPage = ({ onLogout, onBack, onNavigateToProfile, onNavigateToAppSettings, onNavigateToSetupWizard, userData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [activeSection, setActiveSection] = useState('personal');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  // Load current user data
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || ''
      }));
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBack = () => {
    scrollToTop();
    onBack();
  };

  const handleResetSetupWizard = () => {
    // Reset the setup completion flag in user data
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    
    if (allUsers[currentUserEmail]) {
      // Mark setup as incomplete to trigger the wizard
      allUsers[currentUserEmail].setupComplete = false;
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
      
      // Update current user data
      localStorage.setItem('userData', JSON.stringify(allUsers[currentUserEmail]));
      
      // Navigate to setup wizard
      scrollToTop();
      onNavigateToSetupWizard();
    }
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordChange = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    if (validatePersonalInfo()) {
      // Update user data in localStorage
      const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
      const updatedUser = {
        ...currentUser,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };
      
      // Update in allUsers object
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
      const oldEmail = currentUser.email;
      
      // If email changed, we need to update the key in allUsers
      if (oldEmail !== formData.email) {
        delete allUsers[oldEmail];
        allUsers[formData.email] = updatedUser;
        localStorage.setItem('currentUserEmail', formData.email);
      } else {
        allUsers[formData.email] = updatedUser;
      }
      
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setSuccessMessage('Personal information updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (validatePasswordChange()) {
      // Verify current password
      const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
      if (currentUser.password !== formData.currentPassword) {
        setErrors({ currentPassword: 'Current password is incorrect' });
        return;
      }
      
      // Update password
      const updatedUser = {
        ...currentUser,
        password: formData.newPassword
      };
      
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
      allUsers[currentUser.email] = updatedUser;
      
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setSuccessMessage('Password updated successfully!');
      setShowPasswordSection(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="profile-settings-page">
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
            <h1>Profile Settings</h1>
            <p>Manage your personal information and account settings</p>
          </div>
        </div>

        {successMessage && (
          <div className="success-message">
            ✅ {successMessage}
          </div>
        )}

        <div className="settings-container">
          <div className="settings-sidebar">
            <div className="sidebar-section">
              <h3>Profile</h3>
              <button 
                className={`sidebar-item ${activeSection === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveSection('personal')}
              >
                👤 Personal Information
              </button>
              <button 
                className={`sidebar-item ${activeSection === 'security' ? 'active' : ''}`}
                onClick={() => setActiveSection('security')}
              >
                🔒 Security
              </button>
              <button 
                className={`sidebar-item ${activeSection === 'payment' ? 'active' : ''}`}
                onClick={() => setActiveSection('payment')}
              >
                💳 Payment Methods
              </button>
              <button 
                className={`sidebar-item ${activeSection === 'setup' ? 'active' : ''}`}
                onClick={() => setActiveSection('setup')}
              >
                ⚙️ Setup & Onboarding
              </button>
            </div>
          </div>

          <div className="settings-main">
            {/* Personal Information Section */}
            {activeSection === 'personal' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Personal Information</h2>
                  <p>Update your personal details and contact information</p>
                </div>

                <form onSubmit={handlePersonalInfoSubmit} className="settings-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={errors.name ? 'error' : ''}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                    <small className="form-hint">This email is used for login and notifications</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                    />
                    <small className="form-hint">Optional - Used for important service updates</small>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-button">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Security Settings</h2>
                  <p>Manage your password and security preferences</p>
                </div>

                <div className="security-options">
                  <div className="security-item">
                    <div className="security-info">
                      <h3>Password</h3>
                      <p>Last updated: Recently</p>
                    </div>
                    <button 
                      className="change-password-button"
                      onClick={() => setShowPasswordSection(!showPasswordSection)}
                    >
                      {showPasswordSection ? 'Cancel' : 'Change Password'}
                    </button>
                  </div>

                  {showPasswordSection && (
                    <form onSubmit={handlePasswordSubmit} className="password-form">
                      <div className="form-group">
                        <label htmlFor="currentPassword">Current Password *</label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className={errors.currentPassword ? 'error' : ''}
                        />
                        {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                      </div>

                      <div className="form-group">
                        <label htmlFor="newPassword">New Password *</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className={errors.newPassword ? 'error' : ''}
                        />
                        {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                        <small className="form-hint">Must be at least 6 characters</small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password *</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={errors.confirmPassword ? 'error' : ''}
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="save-button">
                          Update Password
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Payment Methods Section */}
            {activeSection === 'payment' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Payment Methods</h2>
                  <p>Manage your payment information for services</p>
                </div>

                <div className="payment-placeholder">
                  <div className="placeholder-content">
                    <div className="placeholder-icon">💳</div>
                    <h3>Payment Methods Coming Soon</h3>
                    <p>
                      We're working on adding secure payment options for your service requests. 
                      This feature will be available in a future update.
                    </p>
                    <div className="planned-features">
                      <h4>Planned Features:</h4>
                      <ul>
                        <li>Credit & Debit Cards</li>
                        <li>Digital Wallets</li>
                        <li>Automatic Billing</li>
                        <li>Payment History</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Setup & Onboarding Section */}
            {activeSection === 'setup' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Setup & Onboarding</h2>
                  <p>Manage your account setup and onboarding preferences</p>
                </div>

                <div className="setup-options">
                  <div className="setup-card">
                    <div className="setup-card-content">
                      <div className="setup-icon">⚙️</div>
                      <div className="setup-text">
                        <h3>Reset Setup Wizard</h3>
                        <p>
                          Re-run the initial setup wizard to update your preferences, 
                          property information, or account type. This will guide you 
                          through all the setup steps again.
                        </p>
                      </div>
                      <button 
                        className="setup-action-btn"
                        onClick={handleResetSetupWizard}
                      >
                        Start Setup Wizard
                      </button>
                    </div>
                  </div>

                  <div className="setup-card">
                    <div className="setup-card-content">
                      <div className="setup-icon">📋</div>
                      <div className="setup-text">
                        <h3>Account Information</h3>
                        <p>
                          Your account was created on {userData?.createdDate || 'Unknown'}.
                          User type: {userData?.userType || 'Not specified'}.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;