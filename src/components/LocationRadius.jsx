import React, { useState } from 'react';
import './LocationRadius.css';

const LocationRadius = ({ radius, onRadiusChange, property }) => {
  const [selectedRadius, setSelectedRadius] = useState(radius);

  const handleRadiusChange = (newRadius) => {
    setSelectedRadius(newRadius);
    onRadiusChange(newRadius);
  };

  const radiusOptions = [
    { value: 5, label: '5 miles', description: 'Local area only' },
    { value: 10, label: '10 miles', description: 'Nearby areas' },
    { value: 15, label: '15 miles', description: 'Extended area' },
    { value: 25, label: '25 miles', description: 'Wide coverage' },
    { value: 50, label: '50 miles', description: 'Maximum range' }
  ];

  const getEstimatedHandymen = (radius) => {
    // Simulate estimated number of handymen based on radius
    const baseCount = 3;
    const multiplier = Math.floor(radius / 5);
    return Math.min(baseCount + (multiplier * 2), 20);
  };

  const getSearchTime = (radius) => {
    if (radius <= 10) return 'Usually find matches within 2-4 hours';
    if (radius <= 25) return 'Usually find matches within 4-8 hours';
    return 'Usually find matches within 8-24 hours';
  };

  return (
    <div className="location-radius">
      <div className="section-header">
        <h3>Search Radius</h3>
        <p>How far should we look for handymen around your property?</p>
      </div>

      {/* Property Display */}
      {property && (
        <div className="property-location">
          <div className="location-icon">📍</div>
          <div className="location-info">
            <h4>Service Location</h4>
            <p>{property.address}</p>
          </div>
        </div>
      )}

      {/* Visual Map Representation */}
      <div className="radius-visual">
        <div className="map-container">
          <div className="map-background">
            <div className="property-marker">🏠</div>
            <div 
              className="radius-circle" 
              style={{ 
                width: `${Math.min(selectedRadius * 4, 200)}px`,
                height: `${Math.min(selectedRadius * 4, 200)}px`
              }}
            >
              <div className="radius-label">{selectedRadius} mi</div>
            </div>
            {/* Simulated handyman markers */}
            {Array.from({ length: getEstimatedHandymen(selectedRadius) }, (_, i) => (
              <div 
                key={i}
                className="handyman-marker"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              >
                🔧
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Radius Slider */}
      <div className="radius-controls">
        <div className="slider-container">
          <label htmlFor="radius-slider">Search Radius: {selectedRadius} miles</label>
          <input
            id="radius-slider"
            type="range"
            min="5"
            max="50"
            step="5"
            value={selectedRadius}
            onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
            className="radius-slider"
          />
          <div className="slider-labels">
            <span>5 mi</span>
            <span>25 mi</span>
            <span>50 mi</span>
          </div>
        </div>
      </div>

      {/* Quick Select Options */}
      <div className="radius-quick-select">
        <h4>Quick Select</h4>
        <div className="radius-options">
          {radiusOptions.map(option => (
            <button
              key={option.value}
              className={`radius-option ${selectedRadius === option.value ? 'selected' : ''}`}
              onClick={() => handleRadiusChange(option.value)}
            >
              <div className="option-label">{option.label}</div>
              <div className="option-description">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Search Statistics */}
      <div className="search-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon">👨‍🔧</div>
            <div className="stat-content">
              <div className="stat-number">~{getEstimatedHandymen(selectedRadius)}</div>
              <div className="stat-label">Available Handymen</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-description">{getSearchTime(selectedRadius)}</div>
              <div className="stat-label">Response Time</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-description">
                {selectedRadius <= 10 ? 'Lower travel costs' : 
                 selectedRadius <= 25 ? 'Moderate travel costs' : 'Higher travel costs'}
              </div>
              <div className="stat-label">Travel Costs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Radius Recommendations */}
      <div className="radius-recommendations">
        <h4>💡 Recommendations</h4>
        <div className="recommendation-content">
          {selectedRadius <= 10 && (
            <div className="recommendation">
              <strong>Local Focus:</strong> Great for quick response times and lower costs. 
              Perfect for urgent repairs or when you prefer local professionals.
            </div>
          )}
          {selectedRadius > 10 && selectedRadius <= 25 && (
            <div className="recommendation">
              <strong>Balanced Coverage:</strong> Good mix of options and response times. 
              Recommended for most service requests.
            </div>
          )}
          {selectedRadius > 25 && (
            <div className="recommendation">
              <strong>Wide Search:</strong> Maximum options for specialized services. 
              Best when you need specific expertise or have flexible timing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationRadius;