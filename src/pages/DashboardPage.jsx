import React, { useState } from 'react';
import './DashboardPage.css';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import ServiceRequestCard from '../components/ServiceRequestCard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import UpcomingAppointments from '../components/UpcomingAppointments';
import PropertyDetailsPage from './PropertyDetailsPage';
import { 
  mockProperties, 
  mockServiceRequests, 
  mockRecentActivity, 
  mockUpcomingAppointments 
} from '../data/mockData';

const DashboardPage = ({ onLogout, onNavigateToServiceRequest }) => {
  const [activeRequests] = useState(mockServiceRequests.filter(req => req.status !== 'Completed'));
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState(mockProperties);
  
  const handleQuickAction = (actionId) => {
    console.log('Quick action clicked:', actionId);
    // Here you would implement the actual functionality for each action
    switch (actionId) {
      case 'new-request':
        onNavigateToServiceRequest();
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <Navbar onLogout={onLogout} onNavigateToDashboard={handleScrollToTop} />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome back, John!</h1>
          <p className="dashboard-subtitle">Here's what's happening with your properties</p>
        </div>

        <div className="dashboard-grid">
          {/* Properties Section */}
          <section className="dashboard-section properties-section">
            <h2>Your Properties</h2>
            <div className="properties-grid">
              {properties.map(property => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onClick={() => handlePropertyClick(property)}
                />
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="dashboard-section quick-actions-section">
            <QuickActions onAction={handleQuickAction} />
          </section>

          {/* Active Service Requests */}
          <section className="dashboard-section requests-section">
            <h2>Active Service Requests ({activeRequests.length})</h2>
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

          {/* Recent Activity */}
          <section className="dashboard-section activity-section">
            <RecentActivity activities={mockRecentActivity} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
