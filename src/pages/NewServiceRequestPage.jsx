import React, { useState } from 'react';
import './NewServiceRequestPage.css';
import Navbar from '../components/Navbar';
import ImageUpload from '../components/ImageUpload';
import LocationRadius from '../components/LocationRadius';
import ServiceCategorySelector from '../components/ServiceCategorySelector';
import BudgetSelector from '../components/BudgetSelector';

const NewServiceRequestPage = ({ onLogout, onBack, userProperties }) => {
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
  const totalSteps = 4;

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

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.category) newErrors.category = 'Please select a category';
        if (!formData.property) newErrors.property = 'Please select a property';
        break;
      case 2:
        if (!formData.images || formData.images.length === 0) {
          newErrors.images = 'At least one photo is required to help handymen provide accurate quotes';
        }
        break;
      case 3:
        if (!formData.budget) newErrors.budget = 'Please select a budget range';
        break;
      case 4:
        // Final review - all previous validations should be done
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return null;

    return (
      <div className="validation-summary">
        <h4>Please complete the following required fields:</h4>
        <ul>
          {errorKeys.map(key => (
            <li key={key}>{getFieldDisplayName(key)}</li>
          ))}
        </ul>
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
    if (validateStep(currentStep)) {
      if (currentStep === totalSteps) {
        // If on review step (step 4), submit the form
        console.log('Service request submitted:', formData);
        alert('Service request submitted successfully! You will be notified when handymen respond.');
        // Here you would submit to your backend
        onBack(); // Return to dashboard
      } else {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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
      <Navbar onLogout={onLogout} onNavigateToDashboard={onBack} />
      
      <div className="service-request-content">
        <div className="request-header">
          <button className="back-button" onClick={onBack}>
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
                className={`step-label ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
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
                      <button 
                        type="button" 
                        className="edit-step-btn"
                        onClick={() => setCurrentStep(1)}
                      >
                        Edit
                      </button>
                    </div>
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
                  </div>

                  {/* Photos Review */}
                  <div className="review-card">
                    <div className="review-card-header">
                      <h3>📸 Photos</h3>
                      <button 
                        type="button" 
                        className="edit-step-btn"
                        onClick={() => setCurrentStep(2)}
                      >
                        Edit
                      </button>
                    </div>
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
                  </div>

                  {/* Budget & Timeline Review */}
                  <div className="review-card">
                    <div className="review-card-header">
                      <h3>💰 Budget & Timeline</h3>
                      <button 
                        type="button" 
                        className="edit-step-btn"
                        onClick={() => setCurrentStep(3)}
                      >
                        Edit
                      </button>
                    </div>
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
                  </div>

                  {/* Location & Preferences Review */}
                  <div className="review-card">
                    <div className="review-card-header">
                      <h3>📍 Location & Preferences</h3>
                    </div>
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
                  </div>

                  {/* Location Settings */}
                  <div className="location-settings">
                    <LocationRadius 
                      radius={formData.searchRadius}
                      onRadiusChange={handleRadiusChange}
                      property={userProperties?.find(p => p.id === formData.property)}
                    />
                  </div>

                  {/* Additional Options */}
                  <div className="additional-options-card">
                    <h3>Final Details</h3>
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
    </div>
  );
};

export default NewServiceRequestPage;