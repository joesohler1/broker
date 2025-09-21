import React, { useState } from 'react';
import './PropertyDetailsPage.css';
import Navbar from '../components/Navbar';
import PropertyEditForm from '../components/PropertyEditForm';
import PropertyDocuments from '../components/PropertyDocuments';
import PropertyServiceHistory from '../components/PropertyServiceHistory';

const PropertyDetailsPage = ({ property, onLogout, onBack, onPropertyUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [propertyData, setPropertyData] = useState(property);

  const handleEditSave = (updatedProperty) => {
    setPropertyData(updatedProperty);
    setIsEditing(false);
    if (onPropertyUpdate) {
      onPropertyUpdate(updatedProperty);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'history', label: 'Service History', icon: '📋' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' }
  ];

  return (
    <div className="property-details-page">
      <Navbar onLogout={onLogout} onNavigateToDashboard={onBack} />
      
      <div className="property-details-content">
        {/* Header */}
        <div className="property-details-header">
          <div className="back-button-container">
            <button className="back-button" onClick={onBack}>
              ← Back to Dashboard
            </button>
          </div>
          
          <div className="header-main-content">
            <div className="property-header-info">
              <h1>{propertyData.address}</h1>
              
              {/* Centered Property Type */}
              <div className="property-type-section">
                <span className="property-type-centered">{propertyData.type}</span>
              </div>
              
              <div className="property-header-meta">
                <span className={`property-status ${propertyData.status.toLowerCase()}`}>
                  {propertyData.status}
                </span>
              </div>
            </div>
            <div className="property-actions">
              <button 
                className="edit-button"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Edit' : 'Edit Property'}
              </button>
              <button className="new-request-button">
                New Service Request
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="property-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="property-tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {isEditing ? (
                <PropertyEditForm 
                  property={propertyData}
                  onSave={handleEditSave}
                  onCancel={handleEditCancel}
                />
              ) : (
                <div className="property-overview">
                  <div className="overview-grid">
                    <div className="overview-section basic-info">
                      <h3>Basic Information</h3>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Address</label>
                          <span>{propertyData.address}</span>
                        </div>
                        <div className="info-item">
                          <label>Property Type</label>
                          <span>{propertyData.type}</span>
                        </div>
                        <div className="info-item">
                          <label>Size</label>
                          <span>{propertyData.size}</span>
                        </div>
                        <div className="info-item">
                          <label>Year Built</label>
                          <span>{propertyData.yearBuilt}</span>
                        </div>
                        <div className="info-item">
                          <label>Bedrooms</label>
                          <span>{propertyData.bedrooms || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <label>Bathrooms</label>
                          <span>{propertyData.bathrooms || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="overview-section stats">
                      <h3>Service Statistics</h3>
                      <div className="stats-grid">
                        <div className="stat-card">
                          <div className="stat-number">{propertyData.activeRequests}</div>
                          <div className="stat-label">Active Requests</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-number">{propertyData.completedRequests}</div>
                          <div className="stat-label">Completed</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-number">{propertyData.totalSpent || '$0'}</div>
                          <div className="stat-label">Total Spent</div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-number">{propertyData.lastService || 'Never'}</div>
                          <div className="stat-label">Last Service</div>
                        </div>
                      </div>
                    </div>

                    <div className="overview-section quick-stats">
                      <h3>Quick Overview</h3>
                      <div className="quick-stats-list">
                        <div className="quick-stat">
                          <span className="stat-icon">🔧</span>
                          <span className="stat-text">Next maintenance due: {propertyData.nextMaintenance || 'No scheduled maintenance'}</span>
                        </div>
                        <div className="quick-stat">
                          <span className="stat-icon">🛡️</span>
                          <span className="stat-text">Warranty status: {propertyData.warrantyStatus || 'Under warranty'}</span>
                        </div>
                        <div className="quick-stat">
                          <span className="stat-icon">📅</span>
                          <span className="stat-text">Property added: {propertyData.dateAdded || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <PropertyServiceHistory propertyId={propertyData.id} />
          )}

          {activeTab === 'documents' && (
            <PropertyDocuments propertyId={propertyData.id} />
          )}

          {activeTab === 'maintenance' && (
            <div className="maintenance-tab">
              <div className="maintenance-scheduler">
                <h3>Schedule Maintenance</h3>
                <p>Proactive maintenance scheduling coming soon...</p>
                <button className="schedule-maintenance-btn">
                  Schedule Regular Maintenance
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;