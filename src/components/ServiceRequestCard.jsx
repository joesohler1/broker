import React from 'react';
import './ServiceRequestCard.css';

const ServiceRequestCard = ({ request }) => {
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

  return (
    <div className="service-request-card">
      <div className="request-header">
        <div className="request-title">
          <h4>{request.title}</h4>
          <span className="request-id">#{request.id}</span>
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
        </div>
      </div>
      
      <div className="request-details">
        <p className="request-description">{request.description}</p>
        <div className="request-meta">
          <div className="meta-item">
            <span className="meta-label">Property:</span>
            <span className="meta-value">{request.property}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Category:</span>
            <span className="meta-value">{request.category}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Date Created:</span>
            <span className="meta-value">{request.dateCreated}</span>
          </div>
          {request.scheduledDate && (
            <div className="meta-item">
              <span className="meta-label">Scheduled:</span>
              <span className="meta-value">{request.scheduledDate}</span>
            </div>
          )}
        </div>
      </div>

      <div className="request-actions">
        <button className="action-btn view-btn" onClick={() => alert(`Viewing details for request #${request.id}`)}>
          View Details
        </button>
        <button className="action-btn message-btn" onClick={() => alert(`Opening message thread for request #${request.id}`)}>
          Message
        </button>
      </div>
    </div>
  );
};

export default ServiceRequestCard;