import React, { useState } from 'react';
import './NewServiceRequestPage.css';
import Navbar from '../components/Navbar';
import ImageUpload from '../components/ImageUpload';
import LocationRadius from '../components/LocationRadius';
import ServiceCategorySelector from '../components/ServiceCategorySelector';
import BudgetSelector from '../components/BudgetSelector';
import { scrollToTop } from '../utils/scrollUtils';

const NewServiceRequestPage = ({ onLogout, onBack, onNavigateToProfile, onNavigateToAppSettings, userProperties }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    property: userProperties?.[0]?.id || '',
    images: [],
    budget: '',
    timeline: '',
    searchRadius: 10, // miles
    preferredTiming: 'flexible',
    contactMethod: 'app',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const totalSteps = 4;

  // State to track which sections are in edit mode
  const [editingSections, setEditingSections] = useState({
    serviceDetails: false,
    photos: false,
    budget: false,
    location: false
  });

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

  const handleImageUpload = (images) => {
    setFormData(prev => ({
      ...prev,
      images: images
    }));
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({
      ...prev,
      category: category
    }));
    
    if (errors.category) {
      setErrors(prev => ({
        ...prev,
        category: ''
      }));
    }
  };

  const handleRadiusChange = (radius) => {
    setFormData(prev => ({
      ...prev,
      searchRadius: radius
    }));
  };

  // Functions to handle inline editing
  const toggleSectionEdit = (section) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const saveSectionEdit = (section) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: false
    }));
    // Validation could be added here if needed
  };

  const cancelSectionEdit = (section) => {
    // Could restore previous values here if we wanted to support cancel
    setEditingSections(prev => ({
      ...prev,
      [section]: false
    }));
  };

  const handleBudgetChange = (budget) => {
    setFormData(prev => ({
      ...prev,
      budget: budget
    }));
    
    if (errors.budget) {
      setErrors(prev => ({
        ...prev,
        budget: ''
      }));
    }
  };

  const handleTimelineChange = (timeline) => {
    setFormData(prev => ({
      ...prev,
      timeline: timeline
    }));
  };

  // Comprehensive validation for all steps before final submission
  const validateAllSteps = () => {
    const allErrors = {};
    
    // Step 1: Details validation
    if (!formData.title.trim()) allErrors.title = 'Title is required';
    if (!formData.description.trim()) allErrors.description = 'Description is required';
    if (!formData.category) allErrors.category = 'Please select a category';
    if (!formData.property) allErrors.property = 'Please select a property';
    
    // Step 2: Photos validation
    if (!formData.images || formData.images.length === 0) {
      allErrors.images = 'At least one photo is required';
    }
    
    // Step 3: Budget validation
    if (!formData.budget) allErrors.budget = 'Please select a budget range';
    
    // Additional validations can be added here
    // Priority validation (if required)
    if (!formData.priority) allErrors.priority = 'Please select priority level';
    
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  // Get missing items organized by step for validation card
  const getMissingItems = () => {
    const missingItems = [];
    
    // Step 1 items
    if (!formData.title.trim()) missingItems.push({ step: 1, item: 'Service Title', stepName: 'Details' });
    if (!formData.description.trim()) missingItems.push({ step: 1, item: 'Description', stepName: 'Details' });
    if (!formData.category) missingItems.push({ step: 1, item: 'Category', stepName: 'Details' });
    if (!formData.property) missingItems.push({ step: 1, item: 'Property', stepName: 'Details' });
    if (!formData.priority) missingItems.push({ step: 1, item: 'Priority Level', stepName: 'Details' });
    
    // Step 2 items
    if (!formData.images || formData.images.length === 0) {
      missingItems.push({ step: 2, item: 'At least one photo', stepName: 'Photos' });
    }
    
    // Step 3 items  
    if (!formData.budget) missingItems.push({ step: 3, item: 'Budget range', stepName: 'Budget' });
    
    return missingItems;
  };

  const getFieldDisplayName = (fieldKey) => {
    const fieldNames = {
      title: 'Service Title',
      description: 'Service Description',
      category: 'Service Category',
      property: 'Property Selection',
      images: 'Photos',
      budget: 'Budget Range'
    };
    return fieldNames[fieldKey] || fieldKey;
  };

  const getValidationSummary = () => {
    const missingItems = getMissingItems();
    if (missingItems.length === 0) return null;

    return (
      <div className="validation-card">
        <div className="validation-header">
          <h3>⚠️ Please Complete Required Fields</h3>
        </div>
        <div className="validation-content">
          <p>The following items are required before submitting:</p>
          <ul className="missing-items-list">
            {missingItems.map((item, index) => (
              <li key={index} className="missing-item">
                <button 
                  className="go-to-step-btn"
                  onClick={() => setCurrentStep(item.step)}
                >
                  Step {item.step}: {item.stepName}
                </button>
                <span className="missing-field">• {item.item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const formatBudgetDisplay = (budget) => {
    if (!budget) return 'Not selected';
    if (budget.startsWith('custom-')) {
      return `$${budget.replace('custom-', '')}`;
    }
    const budgetLabels = {
      'under-100': 'Under $100',
      '100-250': '$100 - $250',
      '250-500': '$250 - $500',
      '500-1000': '$500 - $1,000',
      '1000-2500': '$1,000 - $2,500',
      '2500-5000': '$2,500 - $5,000',
      'over-5000': 'Over $5,000'
    };
    return budgetLabels[budget] || budget;
  };

  const formatTimelineDisplay = (timeline) => {
    const timelineLabels = {
      'same-day': 'Same Day',
      'within-week': 'Within a Week',
      'within-month': 'Within a Month',
      'flexible-timing': 'Flexible Timing'
    };
    return timelineLabels[timeline] || timeline;
  };

  const formatPropertyDisplay = (propertyId) => {
    const property = userProperties?.find(p => p.id === propertyId);
    return property ? `${property.address}` : 'No property selected';
  };

  const formatPriorityDisplay = (priority) => {
    const priorityLabels = {
      'low': 'Low Priority',
      'medium': 'Medium Priority', 
      'high': 'High Priority',
      'emergency': 'Emergency'
    };
    return priorityLabels[priority] || priority;
  };

  const formatContactTimeDisplay = (timing) => {
    const timingLabels = {
      'morning': 'Morning (8AM - 12PM)',
      'afternoon': 'Afternoon (12PM - 5PM)',
      'evening': 'Evening (5PM - 8PM)',
      'flexible': 'Flexible'
    };
    return timingLabels[timing] || timing;
  };

  const nextStep = () => {
    if (currentStep === totalSteps) {
      // On final step, validate all steps before showing confirmation
      if (validateAllSteps()) {
        setShowConfirmDialog(true);
      }
      // Validation errors will show in the validation card below the submit button
    } else {
      // For other steps, just move to next step (no validation required for navigation)
      const newStep = Math.min(currentStep + 1, totalSteps);
      setCurrentStep(newStep);
      // Scroll to top after step change
      setTimeout(() => scrollToTop(), 100);
    }
  };

  const handleConfirmSubmit = () => {
    // Get current user data
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = currentUser.id;

    if (!userId) {
      alert('User session expired. Please log in again.');
      return;
    }

    // Create the service request object with user association
    const serviceRequest = {
      id: Date.now(),
      userId: userId, // Associate with current user
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      property: formData.property,
      images: formData.images,
      budget: formData.budget,
      timeline: formData.timeline,
      searchRadius: formData.searchRadius,
      preferredTiming: formData.preferredTiming,
      contactMethod: formData.contactMethod,
      additionalNotes: formData.additionalNotes,
      status: 'Open',
      dateCreated: new Date().toISOString(),
      responses: []
    };

    // Save to user-specific localStorage key
    const userRequestsKey = `serviceRequests_${userId}`;
    const existingRequests = JSON.parse(localStorage.getItem(userRequestsKey) || '[]');
    const updatedRequests = [...existingRequests, serviceRequest];
    localStorage.setItem(userRequestsKey, JSON.stringify(updatedRequests));

    // Set flag for success popup on dashboard (user-specific)
    localStorage.setItem(`showSuccessPopup_${userId}`, 'true');
    localStorage.setItem(`submittedRequestTitle_${userId}`, serviceRequest.title);

    scrollToTop();
    onBack(); // Return to dashboard with success popup
  };

  const handleBack = () => {
    scrollToTop();
    onBack();
  };

  const handleCancelSubmit = () => {
    setShowConfirmDialog(false);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    // Scroll to top after step change
    setTimeout(() => scrollToTop(), 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prevent default form submission - we handle it through nextStep
  };

  const priorities = [
    { value: 'low', label: 'Low Priority', description: 'Can wait a week or more' },
    { value: 'medium', label: 'Medium Priority', description: 'Needed within a few days' },
    { value: 'high', label: 'High Priority', description: 'Needed within 24 hours' },
    { value: 'emergency', label: 'Emergency', description: 'Immediate attention required' }
  ];

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Job Details';
      case 2: return 'Add Photos';
      case 3: return 'Budget & Timeline';
      case 4: return 'Location & Review';
      default: return 'New Service Request';
    }
  };

  return (
    <div className="new-service-request-page">
      <Navbar 
        onLogout={onLogout} 
        onNavigateToDashboard={handleBack}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToAppSettings={onNavigateToAppSettings}
      />
      
      <div className="service-request-content">
        <div className="request-header">
          <button className="back-button" onClick={handleBack}>
            ← Back to Dashboard
          </button>
          <div className="request-title">
            <h1>Create New Service Request</h1>
            <p>Get connected with qualified handymen in your area</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="step-labels">
            {[1, 2, 3, 4].map(step => (
              <div 
                key={step} 
                className={`step-label ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''} clickable`}
                onClick={() => {
                  setCurrentStep(step);
                }}
                style={{ 
                  cursor: 'pointer'
                }}
              >
                <span className="step-number">{step}</span>
                <span className="step-text">
                  {step === 1 ? 'Details' : step === 2 ? 'Photos' : step === 3 ? 'Budget' : 'Review'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="request-form-container">
          <div className="form-section-header">
            <h2>{getStepTitle()}</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Job Details */}
            {currentStep === 1 && (
              <div className="form-step">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="title">Job Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={errors.title ? 'error' : ''}
                      placeholder="e.g., Fix leaky kitchen faucet"
                      maxLength="100"
                    />
                    {errors.title && <span className="error-message">{errors.title}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="property">Property *</label>
                    <select
                      id="property"
                      name="property"
                      value={formData.property}
                      onChange={handleInputChange}
                      className={errors.property ? 'error' : ''}
                    >
                      <option value="">Select property</option>
                      {userProperties?.map(property => (
                        <option key={property.id} value={property.id}>
                          {property.address}
                        </option>
                      ))}
                    </select>
                    {errors.property && <span className="error-message">{errors.property}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority">Priority Level *</label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className={errors.priority ? 'error' : ''}
                    >
                      <option value="">Select priority level</option>
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label} - {priority.description}
                        </option>
                      ))}
                    </select>
                    {errors.priority && <span className="error-message">{errors.priority}</span>}
                  </div>

                  <div className="form-group full-width">
                    <ServiceCategorySelector 
                      selectedCategory={formData.category}
                      onCategorySelect={handleCategorySelect}
                      error={errors.category}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="description">Detailed Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className={errors.description ? 'error' : ''}
                      placeholder="Describe the issue in detail, including any symptoms, when it started, and what you've already tried..."
                      rows="5"
                      maxLength="1000"
                    />
                    <div className="character-count">
                      {formData.description.length}/1000 characters
                    </div>
                    {errors.description && <span className="error-message">{errors.description}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Photos */}
            {currentStep === 2 && (
              <div className="form-step">
                <div className="photo-section">
                  <ImageUpload 
                    images={formData.images}
                    onImagesChange={handleImageUpload}
                    maxImages={6}
                    required={true}
                    error={errors.images}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Budget & Timeline */}
            {currentStep === 3 && (
              <div className="form-step">
                <div className="budget-timeline-section">
                  <BudgetSelector 
                    budget={formData.budget}
                    timeline={formData.timeline}
                    onBudgetChange={handleBudgetChange}
                    onTimelineChange={handleTimelineChange}
                    errors={errors}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="form-step">
                <div className="review-section">
                  <div className="review-header">
                    <h2>Review Your Service Request</h2>
                    <p>Please review all details before submitting your request</p>
                  </div>

                  {/* Service Details Review */}
                  <div className="review-card">
                    <div className="review-card-header">
                      <h3>🔧 Service Details</h3>
                      {!editingSections.serviceDetails ? (
                        <button 
                          type="button" 
                          className="edit-step-btn"
                          onClick={() => toggleSectionEdit('serviceDetails')}
                        >
                          Edit
                        </button>
                      ) : (
                        <div className="edit-actions">
                          <button 
                            type="button" 
                            className="save-btn"
                            onClick={() => saveSectionEdit('serviceDetails')}
                          >
                            Save
                          </button>
                          <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => cancelSectionEdit('serviceDetails')}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {!editingSections.serviceDetails ? (
                      // Display mode
                      <div className="review-grid">
                        <div className="review-item">
                          <label>Service Title</label>
                          <div className="review-value">{formData.title || 'Not provided'}</div>
                        </div>
                        <div className="review-item">
                          <label>Category</label>
                          <div className="review-value">{formData.category || 'Not selected'}</div>
                        </div>
                        <div className="review-item full-width">
                          <label>Description</label>
                          <div className="review-value description">
                            {formData.description || 'No description provided'}
                          </div>
                        </div>
                        <div className="review-item">
                          <label>Priority</label>
                          <div className="review-value">{formatPriorityDisplay(formData.priority)}</div>
                        </div>
                        <div className="review-item">
                          <label>Property</label>
                          <div className="review-value">{formatPropertyDisplay(formData.property)}</div>
                        </div>
                      </div>
                    ) : (
                      // Edit mode
                      <div className="review-edit-grid">
                        <div className="form-group">
                          <label htmlFor="edit-title">Service Title</label>
                          <input
                            type="text"
                            id="edit-title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Brief title for your service request"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="edit-category">Category</label>
                          <ServiceCategorySelector 
                            selectedCategory={formData.category}
                            onCategorySelect={handleCategorySelect}
                          />
                        </div>
                        
                        <div className="form-group full-width">
                          <label htmlFor="edit-description">Description</label>
                          <textarea
                            id="edit-description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Detailed description of the work needed..."
                            rows="4"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="edit-priority">Priority</label>
                          <select
                            id="edit-priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleInputChange}
                          >
                            <option value="">Select priority level</option>
                            <option value="low">Low Priority - Can wait a week or more</option>
                            <option value="medium">Medium Priority - Within a few days</option>
                            <option value="high">High Priority - Within 24-48 hours</option>
                          </select>
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="edit-property">Property</label>
                          <select
                            id="edit-property"
                            name="property"
                            value={formData.property}
                            onChange={handleInputChange}
                          >
                            <option value="">Select property</option>
                            {userProperties?.map(property => (
                              <option key={property.id} value={property.id}>
                                {property.address}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Photos Review */}
                  <div className="review-card">
                    <div className="review-card-header">
                      <h3>📸 Photos</h3>
                      {!editingSections.photos ? (
                        <button 
                          type="button" 
                          className="edit-step-btn"
                          onClick={() => toggleSectionEdit('photos')}
                        >
                          Edit
                        </button>
                      ) : (
                        <div className="edit-actions">
                          <button 
                            type="button" 
                            className="save-btn"
                            onClick={() => saveSectionEdit('photos')}
                          >
                            Save
                          </button>
                          <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => cancelSectionEdit('photos')}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {!editingSections.photos ? (
                      // Display mode
                      <div className="photos-review">
                        {formData.images && formData.images.length > 0 ? (
                          <div className="photos-grid">
                            {formData.images.map((image, index) => {
                              // Determine the image source safely
                              let imageSrc;
                              if (image.url) {
                                // If image has a URL property, use it
                                imageSrc = image.url;
                              } else if (image instanceof File || image instanceof Blob) {
                                // If image is a File/Blob, create object URL
                                imageSrc = URL.createObjectURL(image);
                              } else if (typeof image === 'string') {
                                // If image is a string URL
                                imageSrc = image;
                              } else {
                                // Fallback - skip this image
                                return null;
                              }

                              return (
                                <div key={index} className="photo-thumbnail">
                                  <img 
                                    src={imageSrc} 
                                    alt={`Upload ${index + 1}`}
                                    onLoad={(e) => {
                                      // Only revoke if we created the URL
                                      if (!image.url && (image instanceof File || image instanceof Blob)) {
                                        URL.revokeObjectURL(e.target.src);
                                      }
                                    }}
                                    onError={(e) => {
                                      console.warn('Failed to load image:', image);
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="no-photos">No photos uploaded</div>
                        )}
                        <div className="photos-count">
                          {formData.images?.length || 0} photo(s) uploaded
                        </div>
                      </div>
                    ) : (
                      // Edit mode
                      <div className="photos-edit-container">
                        <ImageUpload 
                          images={formData.images}
                          onImagesChange={(images) => setFormData(prev => ({...prev, images}))}
                        />
                      </div>
                    )}
                  </div>

                  {/* Budget & Timeline Review */}
                  <div className="review-card">
                    <div className="review-card-header">
                      <h3>💰 Budget & Timeline</h3>
                      {!editingSections.budget ? (
                        <button 
                          type="button" 
                          className="edit-step-btn"
                          onClick={() => toggleSectionEdit('budget')}
                        >
                          Edit
                        </button>
                      ) : (
                        <div className="edit-actions">
                          <button 
                            type="button" 
                            className="save-btn"
                            onClick={() => saveSectionEdit('budget')}
                          >
                            Save
                          </button>
                          <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => cancelSectionEdit('budget')}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {!editingSections.budget ? (
                      // Display mode
                      <div className="review-grid">
                        <div className="review-item">
                          <label>Budget Range</label>
                          <div className="review-value">{formatBudgetDisplay(formData.budget)}</div>
                        </div>
                        <div className="review-item">
                          <label>Preferred Timeline</label>
                          <div className="review-value">{formatTimelineDisplay(formData.timeline)}</div>
                        </div>
                      </div>
                    ) : (
                      // Edit mode
                      <div className="review-edit-grid">
                        <div className="budget-selector-container">
                          <BudgetSelector 
                            selectedBudget={formData.budget}
                            onBudgetSelect={(budget) => setFormData(prev => ({...prev, budget}))}
                            selectedTimeline={formData.timeline}
                            onTimelineSelect={(timeline) => setFormData(prev => ({...prev, timeline}))}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location & Preferences Review */}
                  <div className="review-card">
                    <div className="review-card-header">
                      <h3>📍 Location & Preferences</h3>
                      {!editingSections.location ? (
                        <button 
                          type="button" 
                          className="edit-step-btn"
                          onClick={() => toggleSectionEdit('location')}
                        >
                          Edit
                        </button>
                      ) : (
                        <div className="edit-actions">
                          <button 
                            type="button" 
                            className="save-btn"
                            onClick={() => saveSectionEdit('location')}
                          >
                            Save
                          </button>
                          <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => cancelSectionEdit('location')}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {!editingSections.location ? (
                      // Display mode
                      <div className="review-grid">
                        <div className="review-item">
                          <label>Search Radius</label>
                          <div className="review-value">{formData.searchRadius} miles</div>
                        </div>
                        <div className="review-item">
                          <label>Preferred Contact Time</label>
                          <div className="review-value">{formatContactTimeDisplay(formData.preferredTiming)}</div>
                        </div>
                        {formData.additionalNotes && (
                          <div className="review-item full-width">
                            <label>Additional Notes</label>
                            <div className="review-value description">
                              {formData.additionalNotes}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Edit mode
                      <div className="location-edit-container">
                        <div className="location-settings">
                          <LocationRadius 
                            radius={formData.searchRadius}
                            onRadiusChange={handleRadiusChange}
                            property={userProperties?.find(p => p.id === formData.property)}
                          />
                        </div>

                        <div className="additional-options-card">
                          <div className="options-grid">
                            <div className="form-group">
                              <label htmlFor="preferredTiming">Preferred Contact Time</label>
                              <select
                                id="preferredTiming"
                                name="preferredTiming"
                                value={formData.preferredTiming}
                                onChange={handleInputChange}
                              >
                                <option value="morning">Morning (8AM - 12PM)</option>
                                <option value="afternoon">Afternoon (12PM - 5PM)</option>
                                <option value="evening">Evening (5PM - 8PM)</option>
                                <option value="flexible">Flexible</option>
                              </select>
                            </div>

                            <div className="form-group full-width">
                              <label htmlFor="additionalNotes">Additional Notes (Optional)</label>
                              <textarea
                                id="additionalNotes"
                                name="additionalNotes"
                                value={formData.additionalNotes}
                                onChange={handleInputChange}
                                placeholder="Any additional information, special instructions, or requirements..."
                                rows="3"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Confirmation */}
                  <div className="submit-confirmation">
                    <div className="confirmation-box">
                      <h4>🚀 Ready to Submit?</h4>
                      <p>
                        By submitting this request, qualified handymen in your area will be notified 
                        and can provide quotes for your project. You'll receive notifications when 
                        responses are received.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="form-navigation">
              {currentStep > 1 && (
                <button type="button" className="nav-btn prev-btn" onClick={prevStep}>
                  ← Previous
                </button>
              )}
              
              {currentStep <= totalSteps ? (
                <button type="button" className="nav-btn next-btn" onClick={nextStep}>
                  {currentStep === totalSteps ? 'Submit Request' : 'Next →'}
                </button>
              ) : (
                <button type="submit" className="nav-btn submit-btn">
                  Submit Request
                </button>
              )}
            </div>

            {/* Validation Summary */}
            {Object.keys(errors).length > 0 && getValidationSummary()}
          </form>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <h3>Confirm Submission</h3>
            <p>Are you sure you want to submit your service request?</p>
            <div className="confirmation-details">
              <strong>"{formData.title}"</strong>
              <span className="budget-display">{formData.budget}</span>
            </div>
            <div className="confirmation-buttons">
              <button className="cancel-btn" onClick={handleCancelSubmit}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleConfirmSubmit}>
                Yes, Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewServiceRequestPage;