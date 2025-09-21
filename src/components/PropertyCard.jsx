import React from 'react';
import './PropertyCard.css';

const PropertyCard = ({ property, onClick }) => {
  const handlePropertyClick = () => {
    if (onClick) {
      onClick(property);
    } else {
      alert(`Opening property details for ${property.address}`);
    }
  };

  return (
    <div className="property-card" onClick={handlePropertyClick}>
      <div className="property-header">
        <h3>{property.address}</h3>
        <span className={`property-status ${property.status.toLowerCase()}`}>
          {property.status}
        </span>
      </div>
      
      {/* Centered Property Type */}
      <div className="property-type-section">
        <span className="property-type-label">Type:</span>
        <span className="property-type-value">{property.type}</span>
      </div>
      
      <div className="property-details">
        <div className="detail-item">
          <span className="detail-label">Size:</span>
          <span className="detail-value">{property.size}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Year Built:</span>
          <span className="detail-value">{property.yearBuilt}</span>
        </div>
      </div>
      <div className="property-stats">
        <div className="stat">
          <span className="stat-number">{property.activeRequests}</span>
          <span className="stat-label">Active Requests</span>
        </div>
        <div className="stat">
          <span className="stat-number">{property.completedRequests}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;