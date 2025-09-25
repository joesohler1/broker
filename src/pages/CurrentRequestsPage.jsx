import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './CurrentRequestsPage.css';

const CurrentRequestsPage = ({ onLogout, onBack, onNavigateToEdit }) => {
  const [currentRequests, setCurrentRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock data for current requests - in a real app, this would come from your backend
  useEffect(() => {
    const mockRequests = [
      {
        id: 1,
        title: 'Kitchen Cabinet Installation',
        category: 'Carpentry',
        description: 'Need help installing new kitchen cabinets and countertops. Have all materials ready.',
        budget: '$500-1000',
        timeline: 'this-week',
        priority: 'medium',
        status: 'active',
        createdAt: '2025-09-20T10:30:00Z',
        property: {
          address: '123 Main St, Springfield, IL 62701'
        },
        activity: {
          views: 24,
          likes: 8,
          responses: 3,
          lastActivity: '2025-09-22T08:15:00Z'
        },
        photos: 2,
        handymanResponses: [
          {
            id: 1,
            handymanName: 'Mike Thompson',
            rating: 4.8,
            quote: '$750',
            message: 'I can start this Tuesday morning. 15+ years cabinet experience.',
            respondedAt: '2025-09-21T14:20:00Z'
          },
          {
            id: 2,
            handymanName: 'Sarah Chen',
            rating: 4.9,
            quote: '$680',
            message: 'Available this week. Can provide references from recent kitchen jobs.',
            respondedAt: '2025-09-21T16:45:00Z'
          }
        ]
      },
      {
        id: 2,
        title: 'Bathroom Faucet Repair',
        category: 'Plumbing',
        description: 'Kitchen faucet is leaking and needs immediate repair or replacement.',
        budget: '$100-250',
        timeline: 'asap',
        priority: 'high',
        status: 'active',
        createdAt: '2025-09-21T15:45:00Z',
        property: {
          address: '456 Oak Ave, Springfield, IL 62702'
        },
        activity: {
          views: 18,
          likes: 5,
          responses: 2,
          lastActivity: '2025-09-22T07:30:00Z'
        },
        photos: 1,
        handymanResponses: [
          {
            id: 3,
            handymanName: 'Carlos Rodriguez',
            rating: 4.7,
            quote: '$180',
            message: 'Can fix today. Licensed plumber with all parts in stock.',
            respondedAt: '2025-09-22T07:30:00Z'
          }
        ]
      },
      {
        id: 3,
        title: 'Deck Staining Project',
        category: 'Painting',
        description: 'Large deck needs cleaning and re-staining. Approximately 400 sq ft.',
        budget: '$300-500',
        timeline: 'flexible',
        priority: 'low',
        status: 'completed',
        createdAt: '2025-09-15T09:20:00Z',
        completedAt: '2025-09-19T16:00:00Z',
        property: {
          address: '789 Pine Rd, Springfield, IL 62703'
        },
        activity: {
          views: 31,
          likes: 12,
          responses: 5,
          lastActivity: '2025-09-19T16:00:00Z'
        },
        photos: 3,
        handymanResponses: [
          {
            id: 4,
            handymanName: 'David Kim',
            rating: 5.0,
            quote: '$420',
            message: 'Completed successfully! Deck looks amazing.',
            respondedAt: '2025-09-16T10:15:00Z',
            hired: true
          }
        ]
      }
    ];
    setCurrentRequests(mockRequests);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'in-progress': return '#ffc107';
      case 'completed': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#17a2b8';
    }
  };

  const handleEditRequest = (request) => {
    if (onNavigateToEdit) {
      onNavigateToEdit(request);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredRequests = currentRequests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status === filterStatus;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'most-active':
        return b.activity.views - a.activity.views;
      case 'most-responses':
        return b.activity.responses - a.activity.responses;
      default:
        return 0;
    }
  });

  return (
    <div className="current-requests-page">
      <Navbar onLogout={onLogout} onNavigateToDashboard={onBack} />
      
      <div className="requests-content">
        <div className="requests-header">
          <div className="header-main">
            <button type="button" className="back-button" onClick={onBack}>
              ← Back to Dashboard
            </button>
            <div className="page-title">
              <h1>Current Requests</h1>
              <p>Manage your service requests and track handyman activity</p>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="requests-controls">
            <div className="filters-section">
              <div className="filter-group">
                <label>Filter by Status:</label>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Requests</option>
                  <option value="active">Active</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most-active">Most Views</option>
                  <option value="most-responses">Most Responses</option>
                </select>
              </div>
            </div>

            <div className="requests-summary">
              <div className="summary-stat">
                <span className="stat-number">{currentRequests.length}</span>
                <span className="stat-label">Total Requests</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">{currentRequests.filter(r => r.status === 'active').length}</span>
                <span className="stat-label">Active</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">{currentRequests.reduce((sum, r) => sum + r.activity.responses, 0)}</span>
                <span className="stat-label">Total Responses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="requests-grid">
          {sortedRequests.length > 0 ? sortedRequests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div className="request-title-section">
                  <h3 className="request-title">{request.title}</h3>
                  <div className="request-meta">
                    <span className="category-badge">{request.category}</span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(request.priority) }}
                    >
                      {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="header-metrics">
                  <div className="metric-item">
                    <span className="metric-icon">👀</span>
                    <span className="metric-value">{request.activity.views}</span>
                    <span className="metric-label">views</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-icon">❤️</span>
                    <span className="metric-value">{request.activity.likes}</span>
                    <span className="metric-label">likes</span>
                  </div>
                </div>
              </div>

              <div className="request-content">
                <div className="request-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEditRequest(request)}
                  >
                    ✏️ Edit
                  </button>
                  <button className="action-btn delete-btn">
                    🗑️ Delete
                  </button>
                </div>
                
                <div className="request-description">
                  {request.description}
                </div>
                
                <div className="request-details">
                  <div className="detail-item">
                    <span className="detail-label">📍 Property:</span>
                    <span className="detail-value">{request.property.address}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">💰 Budget:</span>
                    <span className="detail-value">{request.budget}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">📅 Created:</span>
                    <span className="detail-value">{formatTimeAgo(request.createdAt)}</span>
                  </div>
                  {request.photos > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">📸 Photos:</span>
                      <span className="detail-value">{request.photos} uploaded</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="request-footer">
                <div className="last-activity">
                  Last activity: {formatTimeAgo(request.activity.lastActivity)}
                </div>
                <button className="view-details-btn">
                  View Full Details →
                </button>
              </div>
            </div>
          )) : (
            <div className="no-requests">
              <div className="no-requests-content">
                <h3>No requests found</h3>
                <p>You haven't created any service requests yet, or none match your current filters.</p>
                <button className="create-request-btn" onClick={onBack}>
                  Create Your First Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentRequestsPage;