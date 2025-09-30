import React, { useState, useEffect } from 'react';
import './HandymanDashboard.css';
import Navbar from '../components/Navbar';
import { scrollToTop } from '../utils/scrollUtils';

const HandymanDashboard = ({ onLogout, userData }) => {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedJobs: 0,
    activeJobs: 0,
    avgRating: 0,
    bidAccuracy: 0,
    timeEfficiency: 0,
    weeklyEarnings: 0
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

    // Sample active projects with bid tracking
    setActiveProjects([
      {
        id: 1,
        title: "Kitchen Faucet Repair",
        customerName: "Johnson Residence",
        status: "In Progress",
        progress: 75,
        bidHours: 2.5,
        actualHours: 2.1,
        bidAmount: 187.50,
        materialsBudget: 45,
        actualMaterials: 42,
        hourlyRate: 75,
        startDate: "2025-09-25",
        estimatedCompletion: "2025-09-26"
      },
      {
        id: 2,
        title: "Deck Staining",
        customerName: "Smith Property",
        status: "Starting Soon",
        progress: 10,
        bidHours: 4,
        actualHours: 0,
        bidAmount: 300,
        materialsBudget: 85,
        actualMaterials: 0,
        hourlyRate: 75,
        startDate: "2025-09-27",
        estimatedCompletion: "2025-09-27"
      }
    ]);

    // Sample completed jobs for accuracy calculation
    setCompletedJobs([
      { bidHours: 3, actualHours: 2.8, bidMaterials: 50, actualMaterials: 48 },
      { bidHours: 5, actualHours: 5.2, bidMaterials: 120, actualMaterials: 115 },
      { bidHours: 2, actualHours: 1.9, bidMaterials: 30, actualMaterials: 32 }
    ]);

    // Calculate stats
    setStats({
      totalEarnings: 2150,
      completedJobs: 12,
      activeJobs: 2,
      avgRating: 4.8,
      bidAccuracy: 89,
      timeEfficiency: 108,
      weeklyEarnings: 1240
    });
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
      
      <div className="handyman-dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome back, {userData?.name?.split(' ')[0] || 'Professional'}!</h1>
          <p className="dashboard-subtitle">Ready to grow your business today?</p>
        </div>

        {/* Mobile-First: Calendar → Metrics Layout */}
        <div className="heart-brain-container">
          {/* MOBILE FIRST: Calendar (Brain) - What's Next? */}
          <div className="brain-card">
            <div className="calendar-header">
              <h2>Your Schedule</h2>
              <div className="calendar-nav">
                <button className="nav-btn">← Prev</button>
                <span className="current-week">Week of Sep 23, 2025</span>
                <button className="nav-btn">Next →</button>
              </div>
            </div>

            {/* Quick Add Job Bar */}
            <div className="quick-add-bar">
              <input 
                type="text" 
                placeholder="Quick add: 'Plumbing at 123 Main St, 2pm tomorrow'"
                className="quick-add-input"
              />
              <button className="quick-add-btn">+ Add Job</button>
            </div>

            {/* Weekly Calendar Grid */}
            <div className="calendar-grid">
              <div className="time-column">
                <div className="time-slot empty"></div>
                {Array.from({length: 12}, (_, i) => {
                  const hour = i + 7; // 7 AM to 6 PM
                  const time = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
                  return <div key={hour} className="time-slot">{time}</div>
                })}
              </div>

              {/* Day Columns */}
              {['Mon\n23', 'Tue\n24', 'Wed\n25', 'Thu\n26', 'Fri\n27', 'Sat\n28', 'Sun\n29'].map((day, dayIndex) => (
                <div key={day} className="day-column">
                  <div className="day-header">{day.replace('\n', ' ')}</div>
                  
                  {/* Time slots for each day */}
                  <div className="day-slots">
                    {/* Sample jobs */}
                    {dayIndex === 1 && ( // Tuesday
                      <>
                        <div className="job-block plumbing" style={{top: '120px', height: '120px'}}>
                          <div className="job-title">Kitchen Sink Repair</div>
                          <div className="job-details">9:00 AM - 11:00 AM</div>
                          <div className="job-location">📍 123 Main St</div>
                          <div className="job-actions">
                            <button className="action-icon">✓</button>
                            <button className="action-icon">📞</button>
                            <button className="action-icon">📍</button>
                          </div>
                        </div>
                        <div className="job-block electrical" style={{top: '240px', height: '180px'}}>
                          <div className="job-title">Outlet Installation</div>
                          <div className="job-details">1:00 PM - 4:00 PM</div>
                          <div className="job-location">📍 456 Oak Ave</div>
                          <div className="job-actions">
                            <button className="action-icon">✓</button>
                            <button className="action-icon">📞</button>
                            <button className="action-icon">📍</button>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {dayIndex === 3 && ( // Thursday
                      <div className="job-block carpentry" style={{top: '180px', height: '120px'}}>
                        <div className="job-title">Deck Repair</div>
                        <div className="job-details">11:00 AM - 1:00 PM</div>
                        <div className="job-location">📍 789 Pine St</div>
                        <div className="job-actions">
                          <button className="action-icon">✓</button>
                          <button className="action-icon">📞</button>
                          <button className="action-icon">📍</button>
                        </div>
                      </div>
                    )}

                    {/* Drop zones for easy scheduling */}
                    {Array.from({length: 12}, (_, slotIndex) => (
                      <div 
                        key={slotIndex}
                        className="drop-zone"
                        style={{top: `${slotIndex * 60}px`}}
                        onClick={() => {/* Quick schedule modal */}}
                      >
                        <span className="drop-hint">+ Schedule here</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Smart Suggestions */}
            <div className="schedule-suggestions">
              <h4>🤖 Smart Scheduling</h4>
              <div className="suggestions-list">
                <div className="schedule-suggestion">
                  <div className="suggestion-info">
                    <strong>Optimal Route:</strong> Schedule 456 Oak Ave after 123 Main St (both Tuesday)
                  </div>
                  <button className="apply-suggestion">Apply</button>
                </div>
                <div className="schedule-suggestion">
                  <div className="suggestion-info">
                    <strong>Buffer Time:</strong> Add 30min buffer before Deck Repair (travel time)
                  </div>
                  <button className="apply-suggestion">Apply</button>
                </div>
                <div className="schedule-suggestion">
                  <div className="suggestion-info">
                    <strong>Peak Hours:</strong> You earn 23% more 10am-2pm. Move morning job later?
                  </div>
                  <button className="apply-suggestion">Consider</button>
                </div>
              </div>
            </div>
          </div>

          {/* SECOND: Performance Overview (Heart) - How Am I Doing? */}
          <div className="heart-card">
            <h2>Performance Overview</h2>
          
          <div className="overview-grid">
            {/* Primary Bid Accuracy Card */}
            <div className="insight-card primary-overview">
              <div className="insight-header">
                <div className="insight-icon">🎯</div>
                <div className="insight-info">
                  <h3>{stats.bidAccuracy}%</h3>
                  <p>Overall Bid Accuracy</p>
                </div>
              </div>
              
              <div className="insight-chart">
                <div className="accuracy-bar">
                  <div 
                    className="accuracy-fill" 
                    style={{ width: `${stats.bidAccuracy}%` }}
                  ></div>
                </div>
                <div className="accuracy-labels">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="insight-tip">
                {stats.bidAccuracy >= 85 ? (
                  <p className="tip success">🎉 Excellent accuracy! You're competitive and profitable.</p>
                ) : stats.bidAccuracy >= 70 ? (
                  <p className="tip warning">⚡ Good accuracy. Focus on material cost estimation.</p>
                ) : (
                  <p className="tip danger">🔧 Consider tracking time more carefully on similar jobs.</p>
                )}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="quick-stats-grid">
              <div className="quick-stat">
                <div className="quick-stat-icon">⚡</div>
                <div className="quick-stat-info">
                  <div className="quick-stat-value">{stats.timeEfficiency}%</div>
                  <div className="quick-stat-label">Time Efficiency</div>
                </div>
              </div>
              
              <div className="quick-stat">
                <div className="quick-stat-icon">💰</div>
                <div className="quick-stat-info">
                  <div className="quick-stat-value">{formatCurrency(stats.weeklyEarnings)}</div>
                  <div className="quick-stat-label">This Week</div>
                </div>
              </div>
              
              <div className="quick-stat">
                <div className="quick-stat-icon">�</div>
                <div className="quick-stat-info">
                  <div className="quick-stat-value">{stats.activeJobs}</div>
                  <div className="quick-stat-label">Active Projects</div>
                </div>
              </div>
            </div>

            {/* Category Trends */}
            <div className="trends-card">
              <h4>Recent Trends by Category</h4>
              <div className="trends-list">
                <div className="trend-item">
                  <span className="trend-label">Plumbing:</span>
                  <span className="trend-accuracy good">94%</span>
                </div>
                <div className="trend-item">
                  <span className="trend-label">Electrical:</span>
                  <span className="trend-accuracy warning">78%</span>
                </div>
                <div className="trend-item">
                  <span className="trend-label">Carpentry:</span>
                  <span className="trend-accuracy good">91%</span>
                </div>
              </div>
            </div>
          </div>

        {/* Active Projects Section */}
        <div className="dashboard-section">
          <h2>Active Projects</h2>
          {activeProjects.length > 0 ? (
            <div className="projects-grid">
              {activeProjects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <h4>{project.title}</h4>
                    <div className="project-progress">
                      <span>{project.progress}%</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <p className="project-description">{project.description}</p>

                  {/* Bid vs Actual Tracking */}
                  <div className="bid-tracking">
                    <div className="tracking-item">
                      <span className="tracking-label">Hours:</span>
                      <span className="tracking-values">
                        {project.actualHours || 0}/{project.bidHours} 
                        <span className={`efficiency ${(project.actualHours || 0) <= project.bidHours ? 'good' : 'over'}`}>
                          ({project.actualHours ? Math.round(((project.bidHours - project.actualHours) / project.bidHours) * 100) : 0}%)
                        </span>
                      </span>
                    </div>
                    
                    <div className="tracking-item">
                      <span className="tracking-label">Materials:</span>
                      <span className="tracking-values">
                        {formatCurrency(project.actualMaterials || 0)}/{formatCurrency(project.materialsBudget)}
                        <span className={`efficiency ${(project.actualMaterials || 0) <= project.materialsBudget ? 'good' : 'over'}`}>
                          ({project.actualMaterials ? Math.round(((project.materialsBudget - project.actualMaterials) / project.materialsBudget) * 100) : 0}%)
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="project-actions">
                    <button className="action-btn primary">Update Progress</button>
                    <button className="action-btn secondary">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-projects">
              <div className="no-projects-icon">📋</div>
              <p>No active projects at the moment</p>
              <button 
                className="browse-jobs-btn"
                onClick={() => setActiveView('browse')}
              >
                Browse Available Jobs
              </button>
            </div>
          )}
        </div>

        </div>
        {/* End of heart-brain-container */}
      </div>
    </div>
  );
};

export default HandymanDashboard;
              <div className="suggestion">
                <div className="suggestion-icon">⏱️</div>
                <div className="suggestion-content">
                  <h5>Track Time Better</h5>
                  <p>Use a timer app for each task phase to improve future estimates</p>
                </div>
              </div>
              <div className="suggestion">
                <div className="suggestion-icon">📊</div>
                <div className="suggestion-content">
                  <h5>Analyze Past Jobs</h5>
                  <p>Review completed projects to identify common overruns</p>
                </div>
              </div>
              <div className="suggestion">
                <div className="suggestion-icon">�️</div>
                <div className="suggestion-content">
                  <h5>Build Buffer Time</h5>
                  <p>Add 10-15% buffer for unexpected complications</p>
                </div>
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
      </div>
    </div>
  );
};

export default HandymanDashboard;