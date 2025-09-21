import React, { useState } from 'react';
import './ServiceCategorySelector.css';

const ServiceCategorySelector = ({ selectedCategory, onCategorySelect, error }) => {
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const categories = [
    { 
      id: 'plumbing', 
      name: 'Plumbing', 
      icon: '🔧', 
      description: 'Leaks, clogs, installations',
      examples: ['Faucet repair', 'Toilet issues', 'Pipe problems', 'Water heater']
    },
    { 
      id: 'electrical', 
      name: 'Electrical', 
      icon: '⚡', 
      description: 'Wiring, outlets, lighting',
      examples: ['Outlet installation', 'Light fixtures', 'Wiring repair', 'Circuit issues']
    },
    { 
      id: 'hvac', 
      name: 'HVAC', 
      icon: '🌡️', 
      description: 'Heating, cooling, ventilation',
      examples: ['AC repair', 'Heater maintenance', 'Duct cleaning', 'Thermostat']
    },
    { 
      id: 'appliance', 
      name: 'Appliance Repair', 
      icon: '🔨', 
      description: 'Fix or install appliances',
      examples: ['Washer/Dryer', 'Dishwasher', 'Refrigerator', 'Oven repair']
    },
    { 
      id: 'carpentry', 
      name: 'Carpentry', 
      icon: '🪚', 
      description: 'Wood work, cabinets, furniture',
      examples: ['Cabinet repair', 'Shelf installation', 'Door hanging', 'Trim work']
    },
    { 
      id: 'painting', 
      name: 'Painting', 
      icon: '🎨', 
      description: 'Interior and exterior painting',
      examples: ['Wall painting', 'Touch-ups', 'Staining', 'Pressure washing']
    },
    { 
      id: 'flooring', 
      name: 'Flooring', 
      icon: '🏠', 
      description: 'Install, repair, refinish floors',
      examples: ['Hardwood repair', 'Tile replacement', 'Carpet installation', 'Laminate']
    },
    { 
      id: 'drywall', 
      name: 'Drywall', 
      icon: '🧱', 
      description: 'Wall repair and installation',
      examples: ['Hole repair', 'Texture matching', 'New installation', 'Patching']
    },
    { 
      id: 'roofing', 
      name: 'Roofing', 
      icon: '🏘️', 
      description: 'Roof repairs and maintenance',
      examples: ['Leak repair', 'Shingle replacement', 'Gutter cleaning', 'Inspection']
    },
    { 
      id: 'landscaping', 
      name: 'Landscaping', 
      icon: '🌿', 
      description: 'Yard work and outdoor maintenance',
      examples: ['Lawn care', 'Tree trimming', 'Garden maintenance', 'Irrigation']
    },
    { 
      id: 'cleaning', 
      name: 'Cleaning', 
      icon: '🧽', 
      description: 'Deep cleaning and maintenance',
      examples: ['Move-out cleaning', 'Post-construction', 'Carpet cleaning', 'Window washing']
    },
    { 
      id: 'security', 
      name: 'Security & Locks', 
      icon: '🔒', 
      description: 'Locks, security systems, safes',
      examples: ['Lock installation', 'Key cutting', 'Security cameras', 'Door repair']
    }
  ];

  const handleCategorySelect = (categoryId) => {
    if (categoryId === 'custom') {
      setShowCustomInput(true);
      onCategorySelect('');
    } else {
      setShowCustomInput(false);
      onCategorySelect(categoryId);
    }
  };

  const handleCustomCategorySubmit = () => {
    if (customCategory.trim()) {
      onCategorySelect(customCategory.trim());
      setShowCustomInput(false);
    }
  };

  const handleCustomCategoryKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCustomCategorySubmit();
    }
  };

  return (
    <div className="service-category-selector">
      <label className="category-label">Service Category *</label>
      <p className="category-description">
        Select the type of service you need. This helps us connect you with the right professionals.
      </p>
      
      <div className="categories-grid">
        {categories.map(category => (
          <div
            key={category.id}
            className={`category-card ${selectedCategory === category.id ? 'selected' : ''}`}
            onClick={() => handleCategorySelect(category.id)}
          >
            <div className="category-icon">{category.icon}</div>
            <div className="category-info">
              <h4 className="category-name">{category.name}</h4>
              <p className="category-desc">{category.description}</p>
              <div className="category-examples">
                {category.examples.slice(0, 2).map((example, index) => (
                  <span key={index} className="example-tag">
                    {example}
                  </span>
                ))}
                {category.examples.length > 2 && (
                  <span className="more-examples">
                    +{category.examples.length - 2} more
                  </span>
                )}
              </div>
            </div>
            {selectedCategory === category.id && (
              <div className="selected-indicator">✓</div>
            )}
          </div>
        ))}
        
        {/* Custom Category Option */}
        <div
          className={`category-card custom-category ${showCustomInput || (selectedCategory && !categories.find(c => c.id === selectedCategory)) ? 'selected' : ''}`}
          onClick={() => handleCategorySelect('custom')}
        >
          <div className="category-icon">➕</div>
          <div className="category-info">
            <h4 className="category-name">Other</h4>
            <p className="category-desc">Custom service category</p>
            <div className="category-examples">
              <span className="example-tag">Specify your need</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Category Input */}
      {showCustomInput && (
        <div className="custom-category-input">
          <label htmlFor="custom-category">Specify your service category:</label>
          <div className="custom-input-group">
            <input
              id="custom-category"
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              onKeyPress={handleCustomCategoryKeyPress}
              placeholder="e.g., Window installation, Deck repair, etc."
              maxLength="50"
              autoFocus
            />
            <button 
              type="button" 
              className="custom-submit-btn"
              onClick={handleCustomCategorySubmit}
              disabled={!customCategory.trim()}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Display selected custom category */}
      {selectedCategory && !categories.find(c => c.id === selectedCategory) && !showCustomInput && (
        <div className="selected-custom-category">
          <div className="custom-category-display">
            <span className="custom-icon">📝</span>
            <span className="custom-text">Custom category: <strong>{selectedCategory}</strong></span>
            <button 
              type="button" 
              className="edit-custom-btn"
              onClick={() => {
                setCustomCategory(selectedCategory);
                setShowCustomInput(true);
              }}
            >
              Edit
            </button>
          </div>
        </div>
      )}

      {error && <span className="error-message">{error}</span>}

      {/* Category Tips */}
      <div className="category-tips">
        <h4>💡 Tips for better matches:</h4>
        <ul>
          <li>Choose the most specific category that fits your needs</li>
          <li>If unsure, select the closest match - you can clarify in the description</li>
          <li>Use "Other" for unique or multi-category projects</li>
          <li>The right category helps us find qualified professionals faster</li>
        </ul>
      </div>
    </div>
  );
};

export default ServiceCategorySelector;