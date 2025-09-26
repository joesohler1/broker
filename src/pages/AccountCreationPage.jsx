import React, { useState } from 'react';
import './AccountCreationPage.css';

const AccountCreationPage = ({ onAccountCreated, onBackToLogin }) => {
  const [touchedFields, setTouchedFields] = useState({});
  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'customer' // Default to customer
  });

  const handleInputChange = (field, value) => {
    setAccountData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format as XXX-XXX-XXXX
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    } else {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (value) => {
    const formattedPhone = formatPhoneNumber(value);
    setAccountData(prev => ({
      ...prev,
      phone: formattedPhone
    }));
  };

  const handleFieldBlur = (field) => {
    setTouchedFields(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const getFieldClass = (field, value, isRequired = false) => {
    const isTouched = touchedFields[field];
    const hasValue = value && value.trim() !== '';
    
    if (isTouched && hasValue) {
      return 'success'; // Green highlight for completed fields
    }
    
    return ''; // Default styling
  };

  const validatePasswords = () => {
    return accountData.password === accountData.confirmPassword && accountData.password.length >= 6;
  };

  const passwordsMatch = () => {
    return accountData.password === accountData.confirmPassword;
  };

  const passwordLengthValid = () => {
    return accountData.password.length >= 6;
  };

  const canProceed = () => {
    return (
      accountData.firstName.trim() !== '' &&
      accountData.lastName.trim() !== '' &&
      accountData.email.trim() !== '' &&
      accountData.email.includes('@') &&
      accountData.password.length >= 6 &&
      validatePasswords()
    );
  };

  const handleCreateAccount = () => {
    if (canProceed()) {
      // In a real app, this would create the account via API
      const userData = {
        id: Date.now(),
        name: `${accountData.firstName} ${accountData.lastName}`,
        email: accountData.email,
        phone: accountData.phone || null,
        password: accountData.password, // Store password (in real app, this would be hashed)
        userType: accountData.userType,
        dateCreated: new Date().toISOString()
      };
      
      // Save user to multi-user storage structure
      const existingUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
      existingUsers[userData.email] = userData;
      localStorage.setItem('allUsers', JSON.stringify(existingUsers));
      
      // Set current user
      localStorage.setItem('currentUserEmail', userData.email);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Clear user-specific setup flags so new users go through setup wizard
      localStorage.removeItem(`hasCompletedSetup_${userData.id}`);
      localStorage.removeItem(`userProperties_${userData.id}`);
      localStorage.removeItem(`serviceRequests_${userData.id}`);
      
      onAccountCreated(userData);
    }
  };

  return (
    <div className="account-creation-page">
      <div className="account-container">
        <div className="account-header">
          <button className="back-to-login" onClick={onBackToLogin}>
            ← Back to Login
          </button>
          <h1>Create Your Account</h1>
          <p className="account-subtitle">Join thousands of homeowners who trust FixBo for their property maintenance</p>
        </div>

        <div className="account-form">
          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>First Name <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="John"
                  value={accountData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  onBlur={() => handleFieldBlur('firstName')}
                  className={getFieldClass('firstName', accountData.firstName, true)}
                />
              </div>
              
              <div className="form-group">
                <label>Last Name <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Smith"
                  value={accountData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  onBlur={() => handleFieldBlur('lastName')}
                  className={getFieldClass('lastName', accountData.lastName, true)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address <span className="required">*</span></label>
              <input
                type="email"
                placeholder="john@example.com"
                value={accountData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleFieldBlur('email')}
                className={getFieldClass('email', accountData.email, true)}
              />
            </div>
          </div>

          {/* Account Type */}
          <div className="form-section">
            <h3>Account Type</h3>
            <p className="section-subtitle">Choose how you'll use FixBo</p>
            
            <div className="user-type-options">
              <div 
                className={`user-type-card ${accountData.userType === 'customer' ? 'selected' : ''}`}
                onClick={() => handleInputChange('userType', 'customer')}
              >
                <div className="user-type-icon">🏠</div>
                <h4>Property Owner</h4>
                <p>Find trusted professionals for your property maintenance needs</p>
              </div>
              
              <div 
                className={`user-type-card ${accountData.userType === 'handyman' ? 'selected' : ''}`}
                onClick={() => handleInputChange('userType', 'handyman')}
              >
                <div className="user-type-icon">🔧</div>
                <h4>Service Professional</h4>
                <p>Connect with property owners and grow your business</p>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="form-section">
            <h3>Security</h3>
            
            <div className="form-group">
              <label>Password <span className="required">*</span></label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={accountData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={() => handleFieldBlur('password')}
                className={getFieldClass('password', accountData.password, true)}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password <span className="required">*</span></label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={accountData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onBlur={() => handleFieldBlur('confirmPassword')}
                className={getFieldClass('confirmPassword', accountData.confirmPassword, true)}
              />
              {touchedFields.confirmPassword && accountData.confirmPassword.length > 0 && !passwordsMatch() && passwordLengthValid() && (
                <span className="password-mismatch">Passwords don't match</span>
              )}
              {touchedFields.confirmPassword && accountData.confirmPassword.length > 0 && !passwordLengthValid() && (
                <span className="password-length-error">Password must be at least 6 characters</span>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-group">
              <label>Phone Number <span className="optional">(optional)</span></label>
              <input
                type="tel"
                placeholder="123-456-7890"
                value={accountData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={() => handleFieldBlur('phone')}
                className={getFieldClass('phone', accountData.phone, false)}
              />
            </div>
          </div>

          {/* Create Account Button */}
          <div className="account-actions">
            <button 
              className="create-account-btn"
              onClick={handleCreateAccount}
              disabled={!canProceed()}
            >
              Create Account & Continue Setup
            </button>
            
            <p className="terms-text">
              By creating an account, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCreationPage;