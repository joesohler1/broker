import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ImageUpload from '../components/ImageUpload';
import ServiceCategorySelector from '../components/ServiceCategorySelector';
import BudgetSelector from '../components/BudgetSelector';
import LocationRadius from '../components/LocationRadius';
import './NewServiceRequestPage.css'; // Reuse the same styles
import { scrollToTop } from '../utils/scrollUtils';

const EditServiceRequestPage = ({ onLogout, onBack, onNavigateToProfile, onNavigateToAppSettings, userProperties, requestData }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    priority: '',
    property: '',
    images: [],
    budget: '',
    timeline: '',
    searchRadius: 10,
    preferredTiming: 'flexible',
    contactMethod: 'app',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // State to track which sections are in edit mode
  const [editingSections, setEditingSections] = useState({
    serviceDetails: false,
    photos: false,
    budget: false,
    location: false
  });

  // Pre-populate form with existing request data
  useEffect(() => {
    if (requestData) {
      setFormData({
        title: requestData.title || '',
        category: requestData.category || '',
        description: requestData.description || '',
        priority: requestData.priority || '',
        property: requestData.property?.id || requestData.property || '',
        images: requestData.images || [],
        budget: requestData.budget || '',
        timeline: requestData.timeline || '',
        searchRadius: requestData.searchRadius || 10,
        preferredTiming: requestData.preferredTiming || 'flexible',
        contactMethod: requestData.contactMethod || 'app',
        additionalNotes: requestData.additionalNotes || ''
      });
    }
  }, [requestData]);

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

  const handleCategorySelect = (category) => {
    setFormData(prev => ({
      ...prev,
      category
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
  };

  const cancelSectionEdit = (section) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: false
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.category) newErrors.category = 'Please select a category';
        if (!formData.property) newErrors.property = 'Please select a property';
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.priority) newErrors.priority = 'Please select a priority';
        break;
      case 2:
        // Photos are optional, no validation needed
        break;
      case 3:
        if (!formData.budget) newErrors.budget = 'Please select a budget range';
        break;
      case 4:
        // Review step, no additional validation
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getValidationSummary = () => {
    const fieldLabels = {
      title: 'Service Title',
      category: 'Category',
      description: 'Description',
      priority: 'Priority Level',
      property: 'Property Selection',
      budget: 'Budget Range',
      timeline: 'Timeline'
    };

    const errorFields = Object.keys(errors);
    if (errorFields.length === 0) return null;

    return (
      <div className="validation-summary">
        <h4>Please fix the following issues:</h4>
        <ul>
          {errorFields.map(field => (
            <li key={field}>
              <strong>{fieldLabels[field] || field}:</strong> {errors[field]}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const formatBudgetDisplay = (budget) => {
    if (!budget) return 'Not selected';
    return budget;
  };

  const formatTimelineDisplay = (timeline) => {
    const timelineLabels = {
      'asap': 'ASAP (Within 24 hours)',
      'this-week': 'This Week (Within 7 days)',
      'next-week': 'Next Week (1-2 weeks)',
      'flexible': 'Flexible (Whenever convenient)'
    };
    return timelineLabels[timeline] || timeline;
  };

  const formatPriorityDisplay = (priority) => {
    const priorityLabels = {
      'low': 'Low Priority - Can wait a week or more',
      'medium': 'Medium Priority - Within a few days',
      'high': 'High Priority - Within 24-48 hours'
    };
    return priorityLabels[priority] || priority;
  };

  const formatPropertyDisplay = (property) => {
    if (!property) return 'No property selected';
    const propertyObj = userProperties?.find(p => p.id === property);
    return propertyObj ? `${propertyObj.address}` : 'No property selected';
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
    if (validateStep(currentStep)) {
      if (currentStep === totalSteps) {
        // If on review step (step 4), save the changes
        alert('Service request updated successfully!');
        // Here you would update to your backend
        scrollToTop();
        onBack(); // Return to current requests
      } else {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        // Scroll to top after step change
        setTimeout(() => scrollToTop(), 100);
      }
    }
  };

  const handleBack = () => {
    scrollToTop();
    onBack();
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    scrollToTop();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prevent default form submission - we handle it through nextStep
  };

  const priorities = [
    { value: 'low', label: 'Low Priority', description: 'Can wait a week or more' },
    { value: 'medium', label: 'Medium Priority', description: 'Within a few days' },
    { value: 'high', label: 'High Priority', description: 'Within 24-48 hours' }
  ];

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
          <div className="header-main">
            <button type="button" className="back-button" onClick={handleBack}>
              ← Back to Current Requests
            </button>
            <div className="request-title">
              <h1>Edit Service Request</h1>
              <p>Update your service request details</p>
            </div>
          </div>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Job Details */}
            {currentStep === 1 && (
              <div className="form-step">
                <div className="step-content">
                  <div className="form-group">
                    <label htmlFor="title">Service Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Brief title for your service request"
                      className={errors.title ? 'error' : ''}
                    />
                    {errors.title && <span className="error-message">{errors.title}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Detailed description of the work needed..."
                      rows="4"
                      className={errors.description ? 'error' : ''}
                    />
                    {errors.description && <span className="error-message">{errors.description}</span>}
                  </div>

                  <div className="form-row">
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
                  </div>

                  <div className="form-group category-group">
                    <label>Service Category *</label>
                    <ServiceCategorySelector 
                      selectedCategory={formData.category}
                      onCategorySelect={handleCategorySelect}
                    />
                    {errors.category && <span className="error-message">{errors.category}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Photos */}
            {currentStep === 2 && (
              <div className="form-step">
                <div className="step-content">
                  <ImageUpload 
                    images={formData.images}
                    onImagesChange={(images) => setFormData(prev => ({...prev, images}))}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Budget & Timeline */}
            {currentStep === 3 && (
              <div className="form-step">
                <div className="step-content">
                  <BudgetSelector 
                    selectedBudget={formData.budget}
                    onBudgetSelect={(budget) => setFormData(prev => ({...prev, budget}))}
                    selectedTimeline={formData.timeline}
                    onTimelineSelect={(timeline) => setFormData(prev => ({...prev, timeline}))}
                  />
                  {errors.budget && <span className="error-message">{errors.budget}</span>}
                </div>
              </div>
            )}

            {/* Step 4: Review Changes - Reuse the same review logic from NewServiceRequestPage */}
            {currentStep === 4 && (
              <div className="form-step">
                <div className="review-section">
                  <div className="review-header">
                    <h2>Review Your Changes</h2>
                    <p>Please review all updated details before saving</p>
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
                      // Edit mode - Same as step 1 but in review format
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
                              let imageSrc;
                              if (image.url) {
                                imageSrc = image.url;
                              } else if (image instanceof File || image instanceof Blob) {
                                imageSrc = URL.createObjectURL(image);
                              } else if (typeof image === 'string') {
                                imageSrc = image;
                              } else {
                                return null;
                              }

                              return (
                                <div key={index} className="photo-thumbnail">
                                  <img 
                                    src={imageSrc} 
                                    alt={`Upload ${index + 1}`}
                                    onLoad={(e) => {
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
                      <h4>💾 Ready to Save Changes?</h4>
                      <p>
                        Your updated service request will be saved and handymen will see 
                        the latest information. Any existing responses will remain intact.
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
                  {currentStep === totalSteps ? 'Save Changes' : 'Next →'}
                </button>
              ) : (
                <button type="submit" className="nav-btn submit-btn">
                  Save Changes
                </button>
              )}
            </div>

            {/* Validation Summary */}
            {Object.keys(errors).length > 0 && getValidationSummary()}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditServiceRequestPage;