import React from 'react';
import './QuickActions.css';

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      id: 'new-request',
      title: 'New Service Request',
      description: 'Report an issue or request maintenance',
      icon: '🔧',
      color: '#3398cc'
    },
    {
      id: 'current-requests',
      title: 'Current Requests',
      description: 'View and manage your active requests',
      icon: '📋',
      color: '#28a745'
    },
    {
      id: 'current-services',
      title: 'Active Service Requests',
      description: 'View contracted work in progress',
      icon: '🔨',
      color: '#9b59b6'
    },
    {
      id: 'emergency',
      title: 'Emergency Service',
      description: 'Urgent repairs needed immediately',
      icon: '🚨',
      color: '#f44336'
    },
    {
      id: 'schedule-maintenance',
      title: 'Schedule Maintenance',
      description: 'Plan routine property maintenance',
      icon: '📅',
      color: '#4caf50'
    },
    {
      id: 'view-history',
      title: 'Service History',
      description: 'View past repairs and maintenance',
      icon: '📊',
      color: '#ff9800'
    },
    {
      id: 'documents',
      title: 'Property Documents',
      description: 'Access warranties, manuals, and records',
      icon: '📄',
      color: '#2196f3'
    },
    {
      id: 'payments',
      title: 'Payment History',
      description: 'View invoices and payment records',
      icon: '💳',
      color: '#607d8b'
    }
  ];

  return (
    <div className="quick-actions">
      <h3>Quick Actions</h3>
      <div className="actions-grid">
        {actions.map(action => (
          <button
            key={action.id}
            className="action-card"
            onClick={() => onAction && onAction(action.id)}
            style={{ borderLeftColor: action.color }}
          >
            <div className="action-icon">{action.icon}</div>
            <div className="action-content">
              <h4>{action.title}</h4>
              <p>{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
