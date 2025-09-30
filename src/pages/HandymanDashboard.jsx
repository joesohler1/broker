import React, { useState, useEffect } from 'react';
import './HandymanDashboard.css';
import Navbar from '../components/Navbar';
import { scrollToTop } from '../utils/scrollUtils';

const HandymanDashboard = ({ onLogout, userData, onNavigateToJobsMarketplace }) => {
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  useEffect(() => {
    // Sample active projects with bid tracking
    setActiveProjects([
      {
        id: 1,
        title: "Kitchen Faucet Repair",
        description: "Replace leaky kitchen faucet and check under-sink plumbing",
        progress: 65,
        bidHours: 2.5,
        actualHours: 2.2,
        bidAmount: 187.50,
        materialsBudget: 75,
        actualMaterials: 68
      },
      {
        id: 2,
        title: "Bathroom Tile Installation", 
        description: "Install new tile flooring in guest bathroom",
        progress: 30,
        bidHours: 4,
        actualHours: null, // Still in progress
        bidAmount: 300,
        materialsBudget: 150,
        actualMaterials: null
      }
    ]);

    // Sample historical data for bid accuracy
    const historicalData = [
      { bidHours: 3, actualHours: 2.8, bidMaterials: 50, actualMaterials: 48 },
      { bidHours: 5, actualHours: 5.2, bidMaterials: 120, actualMaterials: 115 },
      { bidHours: 2, actualHours: 1.9, bidMaterials: 30, actualMaterials: 32 }
    ];

    // Sample stats
    setStats({
      totalEarnings: 2847.50,
      completedJobs: 12,
      activeJobs: 2,
      avgRating: 4.8,
      bidAccuracy: 89,
      timeEfficiency: 94,
      weeklyEarnings: 485
    });
  }, []);

  const handleScrollToTop = () => {
    scrollToTop();
  };

  const handleFindJobs = () => {
    // Navigate to jobs marketplace where homeowners post jobs
    if (onNavigateToJobsMarketplace) {
      onNavigateToJobsMarketplace();
    } else {
      console.log('Navigating to Find Jobs page...');
      // TODO: Add fallback navigation logic
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
        <div className="header-container">
          <div className="dashboard-header">
            <h1>Welcome back, {userData?.name?.split(' ')[0] || 'Professional'}!</h1>
            <p className="dashboard-subtitle">Ready to grow your business today?</p>
          </div>
          
          {/* Find Jobs Button - Positioned separately */}
          <button className="find-jobs-button" onClick={handleFindJobs}>
            <span className="find-jobs-icon">🔍</span>
            Find Jobs
          </button>
        </div>

        {/* Mobile-First: Calendar → Metrics Layout */}
        <div className="heart-brain-container">
          {/* MOBILE FIRST: Calendar (Brain) - What's Next? */}
          <div className="brain-card">
            <div className="calendar-header">
              <h2>This Week's Schedule</h2>
            </div>

            <div className="calendar-grid">
              <div className="time-column">
                <div className="time-slot">8 AM</div>
                <div className="time-slot">10 AM</div>
                <div className="time-slot">12 PM</div>
                <div className="time-slot">2 PM</div>
                <div className="time-slot">4 PM</div>
              </div>
              
              <div className="day-column">
                <div className="day-header">MON</div>
                <div className="day-slots">
                  <div className="job-block plumbing" style={{top: '0px', height: '120px'}}>
                    <div className="job-title">Kitchen Faucet</div>
                    <div className="job-time">8:00-10:00 AM</div>
                  </div>
                </div>
              </div>
              
              <div className="day-column">
                <div className="day-header">TUE</div>
                <div className="day-slots">
                  <div className="job-block painting" style={{top: '60px', height: '180px'}}>
                    <div className="job-title">Bedroom Paint</div>
                    <div className="job-time">9:00-12:00 PM</div>
                  </div>
                </div>
              </div>
              
              <div className="day-column">
                <div className="day-header">WED</div>
                <div className="day-slots">
                  <div className="job-block carpentry" style={{top: '120px', height: '120px'}}>
                    <div className="job-title">Cabinet Repair</div>
                    <div className="job-time">12:00-2:00 PM</div>
                  </div>
                </div>
              </div>
              
              <div className="day-column">
                <div className="day-header">THU</div>
                <div className="day-slots">
                  <div className="job-block electrical" style={{top: '120px', height: '120px'}}>
                    <div className="job-title">Light Fixture</div>
                    <div className="job-time">12:00-2:00 PM</div>
                  </div>
                </div>
              </div>
              
              <div className="day-column">
                <div className="day-header">FRI</div>
                <div className="day-slots">
                  <div className="job-block landscaping" style={{top: '60px', height: '120px'}}>
                    <div className="job-title">Gutter Clean</div>
                    <div className="job-time">9:00-11:00 AM</div>
                  </div>
                </div>
              </div>
              
              <div className="day-column">
                <div className="day-header">SAT</div>
                <div className="day-slots">
                  <div className="job-block hvac" style={{top: '0px', height: '240px'}}>
                    <div className="job-title">AC Maintenance</div>
                    <div className="job-time">8:00-12:00 PM</div>
                  </div>
                </div>
              </div>
              
              <div className="day-column">
                <div className="day-header">SUN</div>
                <div className="day-slots"></div>
              </div>
            </div>
          </div>

          {/* SECOND: Performance Overview (Heart) - How Am I Doing? */}
          <div className="heart-card">
            <h2>Performance Overview</h2>
          
            {/* Primary Bid Accuracy Card - Moved Above Grid */}
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
                  <span>100%</span>
                </div>
              </div>
              
              <div className="insight-tip">
                <div className="tip">
                  <strong>💡 Insight:</strong> Your accuracy is excellent! You're consistently within 10% of your estimates.
                </div>
              </div>
            </div>
          
          <div className="overview-grid">
            {/* Quick Stats - Right Column */}
            <div className="quick-stats-grid">
              {/* Active Jobs */}
              <div className="quick-stat">
                <div className="quick-stat-icon">
                  <span>🚀</span>
                </div>
                <div className="quick-stat-info">
                  <div className="quick-stat-value">{stats.activeJobs}</div>
                  <div className="quick-stat-label">Active Projects</div>
                </div>
              </div>

              {/* Weekly Earnings */}
              <div className="quick-stat">
                <div className="quick-stat-icon">
                  <span>💰</span>
                </div>
                <div className="quick-stat-info">
                  <div className="quick-stat-value">{formatCurrency(stats.weeklyEarnings)}</div>
                  <div className="quick-stat-label">This Week</div>
                </div>
              </div>
            </div>

            {/* Trends Card */}
            <div className="trends-card">
              <h4>🎯 Category Performance</h4>
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

        </div>
        {/* End of heart-brain-container */}
      </div>
    </div>
  );
};

export default HandymanDashboard;