import React, { useState, useEffect } from 'react';
import './HandymanDashboard.css';
import Navbar from '../components/Navbar';
import { scrollToTop } from '../utils/scrollUtils';

const HandymanDashboard = ({ onLogout, userData }) => {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedJobs: 0,
    activeJobs: 0,
    avgRating: 0
  });

  const handleScrollToTop = () => {
    scrollToTop();
  };

  // Load available jobs from customer service requests
  useEffect(() => {
    // Get all users and their service requests
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
    const jobs = [];
    
    Object.values(allUsers).forEach(user => {
      if (user.userType === 'customer') {
        const userRequests = JSON.parse(localStorage.getItem(`serviceRequests_${user.id}`) || '[]');
        userRequests.forEach(request => {
          if (request.status === 'Pending' || request.status === 'Open') {
            jobs.push({
              ...request,
              customerId: user.id,
              customerName: user.name,
              customerEmail: user.email
            });
          }
        });
      }
    });
    
    setAvailableJobs(jobs);
  }, []);

  const handleBidOnJob = (jobId) => {
    alert(`Bidding feature coming soon! Job ID: ${jobId}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="handyman-dashboard">
      <Navbar 
        onLogout={onLogout} 
        onNavigateToDashboard={handleScrollToTop}
        userType="handyman"
      />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome back, {userData?.name?.split(' ')[0] || 'Professional'}!</h1>
          <p className="dashboard-subtitle">Ready to grow your business today?</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>{formatCurrency(stats.totalEarnings)}</h3>
              <p>Total Earnings</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.completedJobs}</h3>
              <p>Jobs Completed</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔧</div>
            <div className="stat-info">
              <h3>{stats.activeJobs}</h3>
              <p>Active Projects</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>{stats.avgRating.toFixed(1)}</h3>
              <p>Average Rating</p>
            </div>
          </div>
        </div>

        {/* Available Jobs */}
        <div className="dashboard-section">
          <h2>Available Jobs Near You</h2>
          {availableJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No jobs available right now</h3>
              <p>Check back soon for new opportunities from property owners</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {availableJobs.slice(0, 6).map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <h4>{job.title}</h4>
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(job.priority) }}
                    >
                      {job.priority || 'Medium'}
                    </span>
                  </div>
                  
                  <p className="job-description">{job.description}</p>
                  
                  <div className="job-details">
                    <div className="job-detail">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{job.category}</span>
                    </div>
                    <div className="job-detail">
                      <span className="detail-label">Budget:</span>
                      <span className="detail-value">{job.budget || 'Not specified'}</span>
                    </div>
                    <div className="job-detail">
                      <span className="detail-label">Timeline:</span>
                      <span className="detail-value">{job.timeline || 'Flexible'}</span>
                    </div>
                    <div className="job-detail">
                      <span className="detail-label">Posted by:</span>
                      <span className="detail-value">{job.customerName}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="bid-button"
                    onClick={() => handleBidOnJob(job.id)}
                  >
                    Submit Bid
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <button className="action-card">
              <div className="action-icon">👤</div>
              <h4>Update Profile</h4>
              <p>Manage your business info and skills</p>
            </button>
            
            <button className="action-card">
              <div className="action-icon">📋</div>
              <h4>My Projects</h4>
              <p>View active and completed work</p>
            </button>
            
            <button className="action-card">
              <div className="action-icon">⭐</div>
              <h4>Reviews</h4>
              <p>See what customers are saying</p>
            </button>
            
            <button className="action-card">
              <div className="action-icon">💬</div>
              <h4>Messages</h4>
              <p>Chat with property owners</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandymanDashboard;