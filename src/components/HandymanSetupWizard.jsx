import React, { useState } from 'react';
import './HandymanSetupWizard.css';
import { scrollToTop } from '../utils/scrollUtils';

const HandymanSetupWizard = ({ onComplete, onSkip, userData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    businessName: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    licenseNumber: '',
    gettingStarted: false,
    hasLiabilityInsurance: false,
    hasWorkersComp: false,
    hasBonding: false,
    insuranceProvider: '',
    policyNumber: '',
    services: [],
    specialties: '',
    availability: {
      monday: { available: false, hours: '9:00-17:00' },
      tuesday: { available: false, hours: '9:00-17:00' },
      wednesday: { available: false, hours: '9:00-17:00' },
      thursday: { available: false, hours: '9:00-17:00' },
      friday: { available: false, hours: '9:00-17:00' },
      saturday: { available: false, hours: '9:00-17:00' },
      sunday: { available: false, hours: '9:00-17:00' }
    },
    hourlyRate: '',
    emergencyRate: '',
    calloutFee: '',
    serviceRadius: ''
  });

  const totalSteps = 5;

  const serviceCategories = [
    { id: 'plumbing', name: 'Plumbing', icon: '🔧' },
    { id: 'electrical', name: 'Electrical', icon: '⚡' },
    { id: 'hvac', name: 'HVAC', icon: '🌡️' },
    { id: 'carpentry', name: 'Carpentry', icon: '🔨' },
    { id: 'painting', name: 'Painting', icon: '🎨' },
    { id: 'flooring', name: 'Flooring', icon: '🪵' },
    { id: 'roofing', name: 'Roofing', icon: '🏠' },
    { id: 'landscaping', name: 'Landscaping', icon: '🌱' },
    { id: 'appliance', name: 'Appliance Repair', icon: '🔧' },
    { id: 'cleaning', name: 'Cleaning', icon: '🧽' },
    { id: 'handyperson', name: 'General Handyperson', icon: '🛠️' },
    { id: 'other', name: 'Other', icon: '⚙️' }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceToggle = (serviceId) => {
    setProfileData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setProfileData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      scrollToTop();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollToTop();
    }
  };

  const handleComplete = () => {
    // Save professional profile data
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = existingUsers.findIndex(user => user.email === userData.email);
    
    if (userIndex >= 0) {
      existingUsers[userIndex] = {
        ...existingUsers[userIndex],
        handymanProfile: profileData,
        profileComplete: true
      };
      localStorage.setItem('users', JSON.stringify(existingUsers));
    }
    
    onComplete();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return profileData.businessName && profileData.firstName && profileData.lastName && profileData.phone;
      case 2:
        return profileData.gettingStarted || profileData.hasLiabilityInsurance || profileData.hasWorkersComp || profileData.hasBonding;
      case 3:
        return profileData.services.length > 0;
      case 4:
        return profileData.hourlyRate && profileData.serviceRadius;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderProgressBar = () => (
    <div className="setup-progress">
      <div className="progress-steps">
        {[1, 2, 3, 4, 5].map(step => (
          <div 
            key={step} 
            className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="progress-text">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );

  const renderBusinessInfoStep = () => (
    <div className="setup-step">
      <h2>Business Information</h2>
      <p className="step-description">Tell us about your business and contact details</p>
      
      <div className="form-row">
        <div className="form-group">
          <label>Business Name *</label>
          <input
            type="text"
            placeholder="Smith Home Repair"
            value={profileData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>First Name *</label>
          <input
            type="text"
            placeholder="John"
            value={profileData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input
            type="text"
            placeholder="Smith"
            value={profileData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            placeholder="(555) 123-4567"
            value={profileData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="john@smithrepair.com"
            value={profileData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Business License Number</label>
        <input
          type="text"
          placeholder="Optional - Enter if applicable"
          value={profileData.licenseNumber}
          onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
        />
        <small>Having a license helps build trust with customers</small>
      </div>
    </div>
  );

  const renderInsuranceLicensesStep = () => (
    <div className="setup-step">
      <h2>Insurance & Professional Status</h2>
      <p className="step-description">Select what applies to your business (choose at least one)</p>
      
      <div className="insurance-section">
        <h3>Professional Coverage</h3>
        <div className="insurance-options">
          <label className="insurance-item">
            <input
              type="checkbox"
              checked={profileData.gettingStarted}
              onChange={(e) => handleInputChange('gettingStarted', e.target.checked)}
            />
            <div className="insurance-info">
              <strong>Getting Started</strong>
              <small>Perfect for students, part-time, or simple handyperson jobs</small>
            </div>
          </label>

          <label className="insurance-item">
            <input
              type="checkbox"
              checked={profileData.hasLiabilityInsurance}
              onChange={(e) => handleInputChange('hasLiabilityInsurance', e.target.checked)}
            />
            <div className="insurance-info">
              <strong>General Liability Insurance</strong>
              <small>Protects against property damage and injuries</small>
            </div>
          </label>

          <label className="insurance-item">
            <input
              type="checkbox"
              checked={profileData.hasWorkersComp}
              onChange={(e) => handleInputChange('hasWorkersComp', e.target.checked)}
            />
            <div className="insurance-info">
              <strong>Workers' Compensation</strong>
              <small>Covers employee injuries on the job</small>
            </div>
          </label>

          <label className="insurance-item">
            <input
              type="checkbox"
              checked={profileData.hasBonding}
              onChange={(e) => handleInputChange('hasBonding', e.target.checked)}
            />
            <div className="insurance-info">
              <strong>Bonding/Surety</strong>
              <small>Protection against theft and damages</small>
            </div>
          </label>
        </div>

        {(profileData.hasLiabilityInsurance || profileData.hasWorkersComp || profileData.hasBonding) && (
          <div className="form-row">
            <div className="form-group">
              <label>Insurance Provider</label>
              <input
                type="text"
                placeholder="State Farm, Allstate, etc."
                value={profileData.insuranceProvider}
                onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Policy Number</label>
              <input
                type="text"
                placeholder="Policy #"
                value={profileData.policyNumber}
                onChange={(e) => handleInputChange('policyNumber', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderServicesStep = () => (
    <div className="setup-step">
      <h2>Services Offered</h2>
      <p className="step-description">Select all services you provide (choose at least one)</p>
      
      <div className="services-grid">
        {serviceCategories.map(service => (
          <label key={service.id} className={`service-card ${profileData.services.includes(service.id) ? 'selected' : ''}`}>
            <input
              type="checkbox"
              checked={profileData.services.includes(service.id)}
              onChange={() => handleServiceToggle(service.id)}
            />
            <div className="service-icon">{service.icon}</div>
            <span className="service-name">{service.name}</span>
          </label>
        ))}
      </div>

      <div className="form-group">
        <label>Additional Specialties</label>
        <textarea
          placeholder="Describe any special skills, certifications, or unique services you offer..."
          value={profileData.specialties}
          onChange={(e) => handleInputChange('specialties', e.target.value)}
          rows="4"
        />
      </div>
    </div>
  );

  const renderAvailabilityPricingStep = () => (
    <div className="setup-step">
      <h2>Availability & Pricing</h2>
      <p className="step-description">Set your schedule and pricing to attract the right customers</p>
      
      <div className="availability-section">
        <h3>Weekly Availability</h3>
        <div className="availability-grid">
          {Object.entries(profileData.availability).map(([day, settings]) => (
            <div key={day} className="availability-row">
              <label className="day-toggle">
                <input
                  type="checkbox"
                  checked={settings.available}
                  onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                />
                <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
              </label>
              {settings.available && (
                <input
                  type="text"
                  placeholder="9:00-17:00"
                  value={settings.hours}
                  onChange={(e) => handleAvailabilityChange(day, 'hours', e.target.value)}
                  className="hours-input"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pricing-section">
        <h3>Pricing Structure</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Standard Hourly Rate *</label>
            <input
              type="number"
              placeholder="45"
              value={profileData.hourlyRate}
              onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
            />
            <small>Your regular hourly rate in USD</small>
          </div>
          <div className="form-group">
            <label>Emergency Rate</label>
            <input
              type="number"
              placeholder="75"
              value={profileData.emergencyRate}
              onChange={(e) => handleInputChange('emergencyRate', e.target.value)}
            />
            <small>After-hours or urgent work rate</small>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Call-out Fee</label>
            <input
              type="number"
              placeholder="25"
              value={profileData.calloutFee}
              onChange={(e) => handleInputChange('calloutFee', e.target.value)}
            />
            <small>Fee for traveling to job site</small>
          </div>
          <div className="form-group">
            <label>Service Radius (miles) *</label>
            <input
              type="number"
              placeholder="15"
              value={profileData.serviceRadius}
              onChange={(e) => handleInputChange('serviceRadius', e.target.value)}
            />
            <small>How far you're willing to travel</small>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="setup-step">
      <h2>Review Your Profile</h2>
      <p className="step-description">Take a moment to review your professional profile</p>
      
      <div className="profile-review">
        <div className="review-section">
          <h3>Business Information</h3>
          <div className="review-item">
            <strong>Business:</strong> {profileData.businessName}
          </div>
          <div className="review-item">
            <strong>Name:</strong> {profileData.firstName} {profileData.lastName}
          </div>
          <div className="review-item">
            <strong>Phone:</strong> {profileData.phone}
          </div>
          {profileData.email && (
            <div className="review-item">
              <strong>Email:</strong> {profileData.email}
            </div>
          )}
          {profileData.licenseNumber && (
            <div className="review-item">
              <strong>License:</strong> {profileData.licenseNumber}
            </div>
          )}
        </div>

        <div className="review-section">
          <h3>Professional Status</h3>
          <div className="insurance-badges">
            {profileData.gettingStarted && <span className="insurance-badge">🎯 Getting Started</span>}
            {profileData.hasLiabilityInsurance && <span className="insurance-badge">✅ Insured</span>}
            {profileData.hasWorkersComp && <span className="insurance-badge">✅ Workers' Comp</span>}
            {profileData.hasBonding && <span className="insurance-badge">✅ Bonded</span>}
          </div>
        </div>

        <div className="review-section">
          <h3>Services</h3>
          <div className="services-badges">
            {profileData.services.map(serviceId => {
              const service = serviceCategories.find(s => s.id === serviceId);
              return service ? (
                <span key={serviceId} className="service-badge">
                  {service.icon} {service.name}
                </span>
              ) : null;
            })}
          </div>
        </div>

        <div className="review-section">
          <h3>Pricing</h3>
          <div className="review-item">
            <strong>Hourly Rate:</strong> ${profileData.hourlyRate}/hr
          </div>
          {profileData.emergencyRate && (
            <div className="review-item">
              <strong>Emergency Rate:</strong> ${profileData.emergencyRate}/hr
            </div>
          )}
          {profileData.calloutFee && (
            <div className="review-item">
              <strong>Call-out Fee:</strong> ${profileData.calloutFee}
            </div>
          )}
          <div className="review-item">
            <strong>Service Radius:</strong> {profileData.serviceRadius} miles
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderBusinessInfoStep();
      case 2:
        return renderInsuranceLicensesStep();
      case 3:
        return renderServicesStep();
      case 4:
        return renderAvailabilityPricingStep();
      case 5:
        return renderReviewStep();
      default:
        return renderBusinessInfoStep();
    }
  };

  return (
    <div className="handyman-setup-wizard">
      <div className="setup-container">
        <div className="setup-header">
          <h1>Complete Your Professional Profile</h1>
          <p>Join our network of trusted service professionals</p>
        </div>

        {renderProgressBar()}
        
        <div className="setup-content">
          {renderCurrentStep()}
        </div>

        <div className="setup-actions">
          <div className="action-buttons">
            {currentStep > 1 && (
              <button 
                className="btn-secondary" 
                onClick={prevStep}
              >
                Previous
              </button>
            )}
            
            <div className="primary-actions">
              {currentStep < totalSteps ? (
                <button 
                  className="btn-primary" 
                  onClick={nextStep}
                  disabled={!canProceed()}
                >
                  Continue
                </button>
              ) : (
                <button 
                  className="btn-primary" 
                  onClick={handleComplete}
                >
                  Complete Profile
                </button>
              )}
            </div>
          </div>

          <button className="btn-link" onClick={onSkip}>
            Skip setup for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HandymanSetupWizard;