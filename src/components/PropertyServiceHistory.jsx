import React, { useState } from 'react';
import './PropertyServiceHistory.css';

const PropertyServiceHistory = ({ propertyId }) => {
  const [serviceHistory] = useState([
    {
      id: 1001,
      title: 'Kitchen Faucet Leak',
      category: 'Plumbing',
      status: 'In-Progress',
      priority: 'Medium',
      dateCreated: '2025-09-18',
      dateCompleted: null,
      cost: null,
      provider: 'ABC Plumbing Services',
      description: 'Kitchen faucet has been dripping constantly. Requires repair or replacement.',
      notes: 'Technician scheduled for Sep 22nd'
    },
    {
      id: 1002,
      title: 'HVAC Annual Maintenance',
      category: 'HVAC',
      status: 'Completed',
      priority: 'Low',
      dateCreated: '2025-08-15',
      dateCompleted: '2025-08-20',
      cost: '$150.00',
      provider: 'Cool Comfort HVAC',
      description: 'Annual HVAC system inspection and filter replacement.',
      notes: 'System running efficiently. Next service due in 12 months.'
    },
    {
      id: 1003,
      title: 'Broken Window Lock',
      category: 'Security',
      status: 'Completed',
      priority: 'High',
      dateCreated: '2025-07-10',
      dateCompleted: '2025-07-12',
      cost: '$85.00',
      provider: 'SecureHome Repairs',
      description: 'Master bedroom window lock mechanism broken.',
      notes: 'Lock replaced with upgraded security hardware.'
    },
    {
      id: 1004,
      title: 'Garage Door Repair',
      category: 'Maintenance',
      status: 'Completed',
      priority: 'Medium',
      dateCreated: '2025-06-05',
      dateCompleted: '2025-06-08',
      cost: '$220.00',
      provider: 'Garage Door Pro',
      description: 'Garage door opener not functioning properly.',
      notes: 'Replaced motor and remote. 2-year warranty included.'
    },
    {
      id: 1005,
      title: 'Landscaping Service',
      category: 'Landscaping',
      status: 'Completed',
      priority: 'Low',
      dateCreated: '2025-05-20',
      dateCompleted: '2025-05-22',
      cost: '$300.00',
      provider: 'Green Thumb Landscaping',
      description: 'Spring cleanup and garden maintenance.',
      notes: 'Seasonal service completed. Summer maintenance scheduled.'
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedRequest, setExpandedRequest] = useState(null);

  const statusOptions = [
    { id: 'all', label: 'All Status' },
    { id: 'pending', label: 'Pending' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  const categoryOptions = [
    { id: 'all', label: 'All Categories' },
    { id: 'plumbing', label: 'Plumbing' },
    { id: 'hvac', label: 'HVAC' },
    { id: 'electrical', label: 'Electrical' },
    { id: 'security', label: 'Security' },
    { id: 'maintenance', label: 'General Maintenance' },
    { id: 'landscaping', label: 'Landscaping' }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#ffa500';
      case 'in-progress': return '#2196f3';
      case 'completed': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#757575';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const filteredHistory = serviceHistory.filter(request => {
    const statusMatch = selectedStatus === 'all' || request.status.toLowerCase() === selectedStatus;
    const categoryMatch = selectedCategory === 'all' || request.category.toLowerCase() === selectedCategory;
    return statusMatch && categoryMatch;
  });

  const totalCost = serviceHistory
    .filter(request => request.cost)
    .reduce((sum, request) => sum + parseFloat(request.cost.replace('$', '')), 0);

  const completedRequests = serviceHistory.filter(request => request.status === 'Completed').length;
  const activeRequests = serviceHistory.filter(request => request.status !== 'Completed' && request.status !== 'Cancelled').length;

  const toggleExpanded = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  // Note: propertyId is used for filtering in a real implementation
  console.log('Showing service history for property:', propertyId);

  return (
    <div className="property-service-history">
      <div className="service-history-header">
        <h3>Service History</h3>
        <div className="history-stats">
          <div className="stat">
            <span className="stat-number">{activeRequests}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat">
            <span className="stat-number">{completedRequests}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat">
            <span className="stat-number">${totalCost.toFixed(2)}</span>
            <span className="stat-label">Total Spent</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="history-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categoryOptions.map(option => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </div>

        <button className="new-request-btn">
          + New Service Request
        </button>
      </div>

      {/* Service History List */}
      <div className="service-history-list">
        {filteredHistory.length === 0 ? (
          <div className="no-history">
            <div className="no-history-icon">📋</div>
            <h4>No service history found</h4>
            <p>No requests match your current filters</p>
          </div>
        ) : (
          filteredHistory.map(request => (
            <div key={request.id} className="service-request-item">
              <div className="request-summary" onClick={() => toggleExpanded(request.id)}>
                <div className="request-info">
                  <div className="request-title-row">
                    <h4>{request.title}</h4>
                    <span className="request-id">#{request.id}</span>
                  </div>
                  <div className="request-meta">
                    <span className="request-category">{request.category}</span>
                    <span className="request-date">
                      Created: {new Date(request.dateCreated).toLocaleDateString()}
                    </span>
                    {request.dateCompleted && (
                      <span className="request-completed">
                        Completed: {new Date(request.dateCompleted).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="request-badges">
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(request.status) }}
                  >
                    {request.status}
                  </span>
                  <span 
                    className="priority-badge" 
                    style={{ backgroundColor: getPriorityColor(request.priority) }}
                  >
                    {request.priority}
                  </span>
                  {request.cost && (
                    <span className="cost-badge">{request.cost}</span>
                  )}
                </div>
                
                <div className="expand-icon">
                  {expandedRequest === request.id ? '▼' : '▶'}
                </div>
              </div>

              {expandedRequest === request.id && (
                <div className="request-details">
                  <div className="details-grid">
                    <div className="detail-section">
                      <h5>Description</h5>
                      <p>{request.description}</p>
                    </div>
                    
                    <div className="detail-section">
                      <h5>Service Provider</h5>
                      <p>{request.provider}</p>
                    </div>
                    
                    {request.notes && (
                      <div className="detail-section">
                        <h5>Notes</h5>
                        <p>{request.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="request-actions">
                    <button className="action-btn">View Full Details</button>
                    <button className="action-btn">Message Provider</button>
                    {request.status !== 'Completed' && (
                      <button className="action-btn">Update Request</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyServiceHistory;