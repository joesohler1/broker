import React, { useState } from 'react';
import './LoginPage.css';
import { scrollToTop } from '../utils/scrollUtils';

const LoginPage = ({ onLogin, onCreateAccount }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    // Check if user exists in new multi-user system
    let allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
    let user = allUsers[formData.email];
    
    // Migration: Check if there's an old single-user stored that needs to be migrated
    if (!user) {
      const oldUserData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (oldUserData.email === formData.email) {
        // If old user doesn't have a password, add the entered password
        if (!oldUserData.password) {
          oldUserData.password = formData.password;
        }
        
        // Migrate old user to new system
        allUsers[oldUserData.email] = oldUserData;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        user = oldUserData;
      }
    }
    
    if (!user) {
      setError({
        type: 'no-account',
        email: formData.email
      });
      return;
    }

    // Validate password (with better error message)
    if (user.password !== formData.password) {
      setError(`Invalid password for ${formData.email}`);
      return;
    }

    // Set current user and login
    localStorage.setItem('currentUserEmail', formData.email);
    localStorage.setItem('userData', JSON.stringify(user));
    
    onLogin();
  };

  const handleCreateAccount = () => {
    // Scroll to top when navigating to account creation
    scrollToTop();
    onCreateAccount();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <p className="login-subtitle">Sign in to your FixBo account</p>
        </div>

        <div className="login-form">
          {error && (
            <div className="error-message">
              {typeof error === 'string' ? error : (
                error.type === 'no-account' ? (
                  <>
                    No account found with email: {error.email}
                    <span 
                      className="signup-link" 
                      onClick={handleCreateAccount}
                    >
                      Don't have an account? Sign up
                    </span>
                  </>
                ) : error
              )}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <button type="submit" className="login-btn">Sign In</button>
            
            <div className="forgot-password">
              <a href="#" className="forgot-link">Forgot your password?</a>
            </div>
          </form>
        </div>

        <div className="signup-section">
          <p>New to FixBo?</p>
          <button className="create-account-link" onClick={handleCreateAccount}>
            Create Your Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
