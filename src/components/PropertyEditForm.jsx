import React, { useState } from 'react';
import './PropertyEditForm.css';

const PropertyEditForm = ({ property, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    address: property.address || '',
    type: property.type || '',
    size: property.size || '',
    yearBuilt: property.yearBuilt || '',
    bedrooms: property.bedrooms || '',
    bathrooms: property.bathrooms || '',
    description: property.description || '',
    notes: property.notes || '',
    warrantyStatus: property.warrantyStatus || 'Under warranty',
    nextMaintenance: property.nextMaintenance || '',
    ...property
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.type.trim()) {
      newErrors.type = 'Property type is required';
    }
    
    if (!formData.size.trim()) {
      newErrors.size = 'Property size is required';
    }
    
    if (!formData.yearBuilt.trim()) {
      newErrors.yearBuilt = 'Year built is required';
    } else if (!/^\d{4}$/.test(formData.yearBuilt) || parseInt(formData.yearBuilt) < 1800 || parseInt(formData.yearBuilt) > new Date().getFullYear()) {
      newErrors.yearBuilt = 'Please enter a valid year';
    }

    if (formData.bedrooms && (!/^\d+$/.test(formData.bedrooms) || parseInt(formData.bedrooms) < 0)) {
      newErrors.bedrooms = 'Please enter a valid number';
    }

    if (formData.bathrooms && (!/^\d+(\.\d)?$/.test(formData.bathrooms) || parseFloat(formData.bathrooms) < 0)) {
      newErrors.bathrooms = 'Please enter a valid number (e.g., 2.5)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const propertyTypes = [
    'Single Family Home',
    'Condo',
    'Townhouse',
    'Duplex',
    'Apartment',
    'Mobile Home',
    'Commercial Property',
    'Other'
  ];

  const warrantyOptions = [
    'Under warranty',
    'Warranty expired',
    'Extended warranty',
    'No warranty',
    'Unknown'
  ];

  return (
    <div className="property-edit-form">
      <div className="form-header">
        <h3>Edit Property Details</h3>
        <p>Update your property information below</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-sections">
          {/* Basic Information */}
          <div className="form-section">
            <h4>Basic Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="address">Property Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="123 Main Street, City, State ZIP"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="type">Property Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={errors.type ? 'error' : ''}
                >
                  <option value="">Select property type</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <span className="error-message">{errors.type}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="size">Property Size *</label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className={errors.size ? 'error' : ''}
                  placeholder="e.g., 2,400 sq ft"
                />
                {errors.size && <span className="error-message">{errors.size}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="yearBuilt">Year Built *</label>
                <input
                  type="text"
                  id="yearBuilt"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  className={errors.yearBuilt ? 'error' : ''}
                  placeholder="e.g., 1995"
                />
                {errors.yearBuilt && <span className="error-message">{errors.yearBuilt}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="bedrooms">Bedrooms</label>
                <input
                  type="text"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className={errors.bedrooms ? 'error' : ''}
                  placeholder="e.g., 3"
                />
                {errors.bedrooms && <span className="error-message">{errors.bedrooms}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="bathrooms">Bathrooms</label>
                <input
                  type="text"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className={errors.bathrooms ? 'error' : ''}
                  placeholder="e.g., 2.5"
                />
                {errors.bathrooms && <span className="error-message">{errors.bathrooms}</span>}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="form-section">
            <h4>Additional Details</h4>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="description">Property Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Brief description of the property..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="warrantyStatus">Warranty Status</label>
                <select
                  id="warrantyStatus"
                  name="warrantyStatus"
                  value={formData.warrantyStatus}
                  onChange={handleChange}
                >
                  {warrantyOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="nextMaintenance">Next Scheduled Maintenance</label>
                <input
                  type="date"
                  id="nextMaintenance"
                  name="nextMaintenance"
                  value={formData.nextMaintenance}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any additional notes or special instructions..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyEditForm;