import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import ServiceRequestCard from '../components/ServiceRequestCard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import UpcomingAppointments from '../components/UpcomingAppointments';
import PropertyDetailsPage from './PropertyDetailsPage';
import { scrollToTop } from '../utils/scrollUtils';
import { 
  mockProperties, 
  mockServiceRequests, 
  mockRecentActivity, 
  mockUpcomingAppointments 
} from '../data/mockData';

const DashboardPage = ({ onLogout, onNavigateToServiceRequest, onNavigateToCurrentRequests, onNavigateToProfile, onNavigateToAppSettings, userProperties = [], userData }) => {
  // Load user's actual service requests from localStorage
  const getUserServiceRequests = () => {
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = currentUser.id;
    
    if (!userId) {
      // No user logged in, return empty array or mock data
      return mockServiceRequests;
    }
    
    // Load user-specific requests
    const userRequestsKey = `serviceRequests_${userId}`;
    const userRequests = JSON.parse(localStorage.getItem(userRequestsKey) || '[]');
    
    // If user has no requests, show mock data for demo purposes
    return userRequests.length > 0 ? userRequests : mockServiceRequests;
  };

  const [activeRequests] = useState(getUserServiceRequests().filter(req => req.status !== 'Completed'));
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState(() => {
    const initialProperties = userProperties.length > 0 ? userProperties : mockProperties;
    return initialProperties;
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successRequestTitle, setSuccessRequestTitle] = useState('');

  // Update properties when userProperties prop changes
  useEffect(() => {
    if (userProperties.length > 0) {
      setProperties(userProperties);
    }
  }, [userProperties]);

  // Check for success popup on component mount
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = currentUser.id;
    
    if (!userId) return;
    
    const shouldShowPopup = localStorage.getItem(`showSuccessPopup_${userId}`) === 'true';
    const requestTitle = localStorage.getItem(`submittedRequestTitle_${userId}`) || '';
    
    if (shouldShowPopup) {
      setShowSuccessPopup(true);
      setSuccessRequestTitle(requestTitle);
      
      // Clear the user-specific flags
      localStorage.removeItem(`showSuccessPopup_${userId}`);
      localStorage.removeItem(`submittedRequestTitle_${userId}`);
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 5000);
    }
  }, []);

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
  };
  
  const handleQuickAction = (actionId) => {
    // Here you would implement the actual functionality for each action
    switch (actionId) {
      case 'new-request':
        onNavigateToServiceRequest();
        break;
      case 'current-requests':
        onNavigateToCurrentRequests();
        break;
      case 'emergency':
        alert('Opening emergency service form...');
        break;
      case 'schedule-maintenance':
        alert('Opening maintenance scheduler...');
        break;
      case 'view-history':
        alert('Opening service history...');
        break;
      case 'documents':
        alert('Opening property documents...');
        break;
      case 'payments':
        alert('Opening payment history...');
        break;
      default:
        break;
    }
  };

  const handleScrollToTop = () => {
    scrollToTop();
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const handleBackToDashboard = () => {
    setSelectedProperty(null);
  };

  const handlePropertyUpdate = (updatedProperty) => {
    setProperties(prevProperties => 
      prevProperties.map(prop => 
        prop.id === updatedProperty.id ? updatedProperty : prop
      )
    );
  };

  // If a property is selected, show the PropertyDetailsPage
  if (selectedProperty) {
    return (
      <PropertyDetailsPage 
        property={selectedProperty}
        onLogout={onLogout}
        onBack={handleBackToDashboard}
        onPropertyUpdate={handlePropertyUpdate}
      />
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar 
        onLogout={onLogout} 
        onNavigateToDashboard={handleScrollToTop}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToAppSettings={onNavigateToAppSettings}
      />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Hi{userData && userData.name ? ` ${userData.name.split(' ')[0]}` : ''}! Here's your dashboard.</h1>
          <p className="dashboard-subtitle">Here's what's happening!</p>
        </div>

        {/* Properties Section */}
        <section className="dashboard-section properties-section">
          <h2>Your Properties</h2>
          <div className="properties-grid">
            {properties.length === 0 ? (
              <div className="no-properties">
                <div className="empty-state-icon">🏠</div>
                <h3>No properties added yet</h3>
                <p>Add your first property to start managing service requests and maintenance.</p>
                <button className="add-property-btn" onClick={() => alert('Add property feature coming soon!')}>
                  ➕ Add Your First Property
                </button>
              </div>
            ) : (
              properties.map(property => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onClick={() => handlePropertyClick(property)}
                />
              ))
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="dashboard-section quick-actions-section">
          <QuickActions onAction={handleQuickAction} />
        </section>

        {/* Active Service Requests */}
        <section className="dashboard-section requests-section">
          <h2>Active Service Requests</h2>
          <div className="requests-grid">
            {activeRequests.length === 0 ? (
              <div className="no-requests">
                <p>No active service requests</p>
                <button className="create-request-btn" onClick={() => handleQuickAction('new-request')}>
                  Create New Request
                </button>
              </div>
            ) : (
              activeRequests.map(request => (
                <ServiceRequestCard key={request.id} request={request} />
              ))
            )}
          </div>
        </section>

          {/* Upcoming Appointments */}
          <section className="dashboard-section appointments-section">
            <UpcomingAppointments appointments={mockUpcomingAppointments} />
          </section>

        {/* Upcoming Appointments */}
        <section className="dashboard-section appointments-section">
          <UpcomingAppointments appointments={mockUpcomingAppointments} />
        </section>

        {/* Recent Activity */}
        <section className="dashboard-section activity-section">
          <RecentActivity activities={mockRecentActivity} />
        </section>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-icon">✅</div>
            <h3>Request Submitted Successfully!</h3>
            <p>Your service request <strong>"{successRequestTitle}"</strong> has been posted.</p>
            <p>Handymen will start responding soon. You'll be notified when they do!</p>
            <button className="continue-btn" onClick={handleCloseSuccessPopup}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
