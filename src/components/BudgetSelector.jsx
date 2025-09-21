import React, { useState } from 'react';
import './BudgetSelector.css';

const BudgetSelector = ({ budget, timeline, onBudgetChange, onTimelineChange, errors }) => {
  const [customBudget, setCustomBudget] = useState('');
  const [showCustomBudget, setShowCustomBudget] = useState(false);

  const budgetRanges = [
    { id: 'under-100', label: 'Under $100', value: 'under-100', min: 0, max: 100 },
    { id: '100-250', label: '$100 - $250', value: '100-250', min: 100, max: 250 },
    { id: '250-500', label: '$250 - $500', value: '250-500', min: 250, max: 500 },
    { id: '500-1000', label: '$500 - $1,000', value: '500-1000', min: 500, max: 1000 },
    { id: '1000-2500', label: '$1,000 - $2,500', value: '1000-2500', min: 1000, max: 2500 },
    { id: '2500-5000', label: '$2,500 - $5,000', value: '2500-5000', min: 2500, max: 5000 },
    { id: 'over-5000', label: 'Over $5,000', value: 'over-5000', min: 5000, max: null },
    { id: 'custom', label: 'Custom Amount', value: 'custom' }
  ];

  const timelineOptions = [
    { id: 'same-day', label: 'Same Day', value: 'same-day' },
    { id: 'within-week', label: 'Within a Week', value: 'within-week' },
    { id: 'within-month', label: 'Within a Month', value: 'within-month' },
    { id: 'flexible-timing', label: 'Flexible Timing', value: 'flexible-timing' }
  ];

  const handleBudgetSelect = (budgetValue) => {
    if (budgetValue === 'custom') {
      setShowCustomBudget(true);
      onBudgetChange('');
    } else {
      setShowCustomBudget(false);
      onBudgetChange(budgetValue);
    }
  };

  const handleCustomBudgetSubmit = () => {
    if (customBudget.trim() && !isNaN(customBudget)) {
      onBudgetChange(`custom-${customBudget}`);
      setShowCustomBudget(false);
    }
  };

  const formatBudgetDisplay = (budgetValue) => {
    if (budgetValue.startsWith('custom-')) {
      const amount = budgetValue.replace('custom-', '');
      return `$${parseFloat(amount).toLocaleString()}`;
    }
    const range = budgetRanges.find(r => r.value === budgetValue);
    return range ? range.label : '';
  };

  return (
    <div className="budget-selector">
      {/* Budget Section */}
      <div className="budget-section">
        <label className="budget-label">Budget Range *</label>
        <p className="budget-description">
          What's your estimated budget for this project? This helps us find professionals in your price range.
        </p>
        
        <div className="budget-grid">
          {budgetRanges.map(range => (
            <div
              key={range.id}
              className={`budget-card ${budget === range.value || (budget.startsWith('custom-') && range.value === 'custom') ? 'selected' : ''}`}
              onClick={() => handleBudgetSelect(range.value)}
            >
              <span className="budget-label-text">{range.label}</span>
              {budget === range.value && (
                <div className="selected-indicator">✓</div>
              )}
            </div>
          ))}
        </div>

        {/* Custom Budget Input */}
        {showCustomBudget && (
          <div className="custom-budget-input">
            <label htmlFor="custom-budget">Enter your budget amount:</label>
            <div className="custom-budget-group">
              <span className="currency-symbol">$</span>
              <input
                id="custom-budget"
                type="number"
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCustomBudgetSubmit()}
                placeholder="0"
                min="1"
                max="999999"
                autoFocus
              />
              <button 
                type="button" 
                className="custom-budget-submit"
                onClick={handleCustomBudgetSubmit}
                disabled={!customBudget.trim() || isNaN(customBudget) || parseFloat(customBudget) <= 0}
              >
                Set Budget
              </button>
            </div>
          </div>
        )}

        {/* Display selected custom budget */}
        {budget && budget.startsWith('custom-') && !showCustomBudget && (
          <div className="selected-custom-budget">
            <div className="custom-budget-display">
              <span className="budget-icon">💰</span>
              <span className="budget-text">Budget: <strong>{formatBudgetDisplay(budget)}</strong></span>
              <button 
                type="button" 
                className="edit-budget-btn"
                onClick={() => {
                  setCustomBudget(budget.replace('custom-', ''));
                  setShowCustomBudget(true);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        )}

        {errors.budget && <span className="error-message">{errors.budget}</span>}
      </div>

      {/* Timeline Section */}
      <div className="timeline-section">
        <label className="timeline-label">Preferred Timeline</label>
        <p className="timeline-description">
          When would you like the work to be completed?
        </p>
        
        <div className="timeline-options">
          {timelineOptions.map(option => (
            <label key={option.id} className="timeline-option">
              <input
                type="radio"
                name="timeline"
                value={option.value}
                checked={timeline === option.value}
                onChange={(e) => onTimelineChange(e.target.value)}
              />
              <span className="timeline-radio"></span>
              <span className="timeline-text">{option.label}</span>
            </label>
          ))}
        </div>

        {errors.timeline && <span className="error-message">{errors.timeline}</span>}
      </div>

      {/* Budget Tips */}
      <div className="budget-tips">
        <h4>💡 Budget & Timeline Tips:</h4>
        <ul>
          <li><strong>Emergency work</strong> typically costs 50-100% more than standard rates</li>
          <li><strong>Flexible timing</strong> often results in better pricing and availability</li>
          <li><strong>Multiple quotes</strong> help ensure you get fair pricing</li>
          <li><strong>Material costs</strong> may be additional depending on the project</li>
          <li><strong>Permits or inspections</strong> may be required for certain work</li>
        </ul>
      </div>
    </div>
  );
};

export default BudgetSelector;