import React from 'react';
import './RecentActivity.css';

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'request_created': return '🆕';
      case 'request_updated': return '🔄';
      case 'request_completed': return '✅';
      case 'appointment_scheduled': return '📅';
      case 'payment_made': return '💰';
      case 'message_received': return '💬';
      default: return '📝';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = Math.floor((now - activityTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return activityTime.toLocaleDateString();
  };

  return (
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        {activities.length === 0 ? (
          <div className="no-activity">
            <p>No recent activity</p>
          </div>
        ) : (
          activities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-content">
                <p className="activity-description">{activity.description}</p>
                <div className="activity-meta">
                  <span className="activity-property">{activity.property}</span>
                  <span className="activity-time">{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {activities.length > 0 && (
        <button 
          className="view-all-btn"
          onClick={() => alert('Opening full activity history...')}
        >
          View All Activity
        </button>
      )}
    </div>
  );
};

export default RecentActivity;