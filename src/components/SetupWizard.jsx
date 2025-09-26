import React, { useState } from 'react';
import './SetupWizard.css';
import { scrollToTop } from '../utils/scrollUtils';

const SetupWizard = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [touchedFields, setTouchedFields] = useState({});
  const [propertyData, setPropertyData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    type: '',
    userRole: '',
    size: '',
    yearBuilt: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    notes: ''
  });

  const userTypeOptions = [
    { id: 'owner', label: 'I own my home', icon: '🏠', description: 'You own the property and are responsible for maintenance' },
    { id: 'renter', label: 'I rent my home', icon: '🔑', description: 'You rent and may coordinate some maintenance requests' },
    { id: 'manager', label: 'I manage properties', icon: '🏢', description: 'You manage multiple properties for others' },
    { id: 'browse', label: 'Just browsing', icon: '👀', description: 'Explore the platform before setting up' }
  ];

  const propertyTypes = [
    'Single Family Home',
    'Condo',
    'Apartment',
    'Townhouse',
    'Duplex',
    'Other'
  ];

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    if (type === 'browse') {
      scrollToTop();
      onSkip();
      return;
    }
    setPropertyData(prev => ({
      ...prev,
      userRole: type === 'owner' ? 'Owner' : type === 'renter' ? 'Renter' : 'Property Manager'
    }));
    scrollToTop();
    setCurrentStep(2);
  };

  const handleInputChange = (field, value) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: value
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

  const handleNext = () => {
    scrollToTop();
    if (currentStep === 2) {
      // Check if required fields are filled
      if (canProceed()) {
        setCurrentStep(prev => prev + 1);
      }
      // No need to show errors since button is disabled when validation fails
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    scrollToTop();
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = () => {
    scrollToTop();
    
    // Combine address parts into a single address string
    const fullAddress = [
      propertyData.street,
      propertyData.city,
      propertyData.state,
      propertyData.zipCode
    ].filter(part => part.trim()).join(', ');

    const property = {
      id: Date.now(), // Simple ID generation for demo
      address: fullAddress || 'Address not provided',
      type: propertyData.type || 'Not specified',
      size: propertyData.size || 'Not specified',
      yearBuilt: propertyData.yearBuilt || 'Unknown',
      bedrooms: propertyData.bedrooms || 'Not specified',
      bathrooms: propertyData.bathrooms || 'Not specified',
      description: propertyData.description || 'No description provided',
      notes: propertyData.notes || '',
      status: 'Active',
      activeRequests: 0,
      completedRequests: 0,
      warrantyStatus: 'Unknown',
      nextMaintenance: null,
      totalSpent: '$0',
      lastService: 'None',
      dateAdded: new Date().toLocaleDateString()
    };
    
    onComplete(property);
  };

  const canProceed = () => {
    if (currentStep === 2) {
      return propertyData.street.trim() !== '' && 
             propertyData.city.trim() !== '' && 
             propertyData.state !== '' && 
             propertyData.type !== '';
    }
    return true;
  };

  const renderStep1 = () => (
    <div className="setup-step">
      <div className="step-header">
        <h2>Welcome to FixBo!</h2>
        <p>Let's get you set up. What describes your situation best?</p>
      </div>
      
      <div className="user-type-options">
        {userTypeOptions.map(option => (
          <button
            key={option.id}
            className="user-type-card"
            onClick={() => handleUserTypeSelect(option.id)}
          >
            <div className="option-icon">{option.icon}</div>
            <div className="option-content">
              <h3>{option.label}</h3>
              <p>{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="setup-step">
      <div className="step-header">
        <h2>Property Information</h2>
        <p>Tell us about your {userType === 'manager' ? 'first property' : 'property'}. You can always add more later!</p>
      </div>

      <div className="property-form">
        <div className="form-section">
          <h3>Basic Information <span className="required">*</span></h3>
          
          <div className="form-group">
            <label>Street Address <span className="required">*</span></label>
            <input
              type="text"
              placeholder="123 Main Street"
              value={propertyData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              onBlur={() => handleFieldBlur('street')}
              className={getFieldClass('street', propertyData.street, true)}
            />
          </div>

          <div className="form-row three-column">
            <div className="form-group">
              <label>City <span className="required">*</span></label>
              <input
                type="text"
                placeholder="City"
                value={propertyData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                onBlur={() => handleFieldBlur('city')}
                className={getFieldClass('city', propertyData.city, true)}
              />
            </div>

            <div className="form-group">
              <label>State <span className="required">*</span></label>
              <select
                value={propertyData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                onBlur={() => handleFieldBlur('state')}
                className={getFieldClass('state', propertyData.state, true)}
              >
                <option value="">State</option>
                {usStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                placeholder="12345"
                value={propertyData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                onBlur={() => handleFieldBlur('zipCode')}
                className={getFieldClass('zipCode', propertyData.zipCode, false)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Property Type <span className="required">*</span></label>
            <select
              value={propertyData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              onBlur={() => handleFieldBlur('type')}
              className={getFieldClass('type', propertyData.type, true)}
            >
              <option value="">Select property type</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section optional">
          <h3>Additional Details <span className="optional-text">(Optional)</span></h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Size (sq ft)</label>
              <input
                type="text"
                placeholder="2,400"
                value={propertyData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Year Built</label>
              <input
                type="text"
                placeholder="1995"
                value={propertyData.yearBuilt}
                onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Bedrooms</label>
              <input
                type="text"
                placeholder="3"
                value={propertyData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Bathrooms</label>
              <input
                type="text"
                placeholder="2"
                value={propertyData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Brief description of your property..."
              value={propertyData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Special Notes</label>
            <textarea
              placeholder="Any special notes about maintenance, warranties, etc..."
              value={propertyData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-back" onClick={handleBack}>
          ← Back
        </button>
        
        <div className="right-actions">
          <button className="btn-skip" onClick={onSkip}>
            Skip for now
          </button>
          <button 
            className="btn-next" 
            onClick={handleNext}
            disabled={!canProceed()}
          >
            Review & Complete
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="setup-step">
      <div className="step-header">
        <h2>Review Your Information</h2>
        <p>Everything looks good? You can always update this later in your dashboard.</p>
      </div>

      <div className="review-card">
        <h3>
          {[
            propertyData.street,
            propertyData.city,
            propertyData.state,
            propertyData.zipCode
          ].filter(part => part.trim()).join(', ') || 'Address not provided'}
        </h3>
        <div className="review-details">
          <div className="review-item">
            <strong>Property Type:</strong> {propertyData.type}
          </div>
          <div className="review-item">
            <strong>Your Role:</strong> {propertyData.userRole}
          </div>
          {propertyData.size && (
            <div className="review-item">
              <strong>Size:</strong> {propertyData.size} sq ft
            </div>
          )}
          {propertyData.yearBuilt && (
            <div className="review-item">
              <strong>Year Built:</strong> {propertyData.yearBuilt}
            </div>
          )}
          {propertyData.bedrooms && (
            <div className="review-item">
              <strong>Bedrooms:</strong> {propertyData.bedrooms}
            </div>
          )}
          {propertyData.bathrooms && (
            <div className="review-item">
              <strong>Bathrooms:</strong> {propertyData.bathrooms}
            </div>
          )}
          {propertyData.description && (
            <div className="review-item">
              <strong>Description:</strong> {propertyData.description}
            </div>
          )}
          {propertyData.notes && (
            <div className="review-item">
              <strong>Notes:</strong> {propertyData.notes}
            </div>
          )}
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-back" onClick={handleBack}>
          ← Edit Details
        </button>
        
        <div className="right-actions">
          <button className="btn-skip" onClick={onSkip}>
            Skip for now
          </button>
          <button className="btn-complete" onClick={handleComplete}>
            Complete Setup 🎉
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="setup-wizard">
      <div className="setup-container">
        <div className="progress-bar">
          <div className="progress-steps">
            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
            <div className={`progress-line ${currentStep >= 2 ? 'active' : ''}`}></div>
            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
            <div className={`progress-line ${currentStep >= 3 ? 'active' : ''}`}></div>
            <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
          </div>
          <div className="progress-labels">
            <span>Welcome</span>
            <span>Property Info</span>
            <span>Review</span>
          </div>
        </div>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default SetupWizard;