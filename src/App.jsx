import { useState } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewServiceRequestPage from './pages/NewServiceRequestPage';
import CurrentRequestsPage from './pages/CurrentRequestsPage';
import EditServiceRequestPage from './pages/EditServiceRequestPage';
import { mockProperties } from './data/mockData';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingRequest, setEditingRequest] = useState(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  const handleNavigateToServiceRequest = () => {
    setCurrentPage('new-service-request');
  };

  const handleNavigateToCurrentRequests = () => {
    setCurrentPage('current-requests');
  };

  const handleNavigateToEdit = (request) => {
    setEditingRequest(request);
    setCurrentPage('edit-service-request');
  };

  const handleBackToCurrentRequests = () => {
    setCurrentPage('current-requests');
    setEditingRequest(null);
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'new-service-request':
        return (
          <NewServiceRequestPage 
            onLogout={handleLogout}
            onBack={handleBackToDashboard}
            userProperties={mockProperties}
          />
        );
      case 'current-requests':
        return (
          <CurrentRequestsPage 
            onLogout={handleLogout}
            onBack={handleBackToDashboard}
            onNavigateToEdit={handleNavigateToEdit}
          />
        );
      case 'edit-service-request':
        return (
          <EditServiceRequestPage 
            onLogout={handleLogout}
            onBack={handleBackToCurrentRequests}
            userProperties={mockProperties}
            requestData={editingRequest}
          />
        );
      case 'dashboard':
      default:
        return (
          <DashboardPage 
            onLogout={handleLogout}
            onNavigateToServiceRequest={handleNavigateToServiceRequest}
            onNavigateToCurrentRequests={handleNavigateToCurrentRequests}
          />
        );
    }
  };

  return (
    <div className={isLoggedIn ? 'app-logged-in' : 'app-logged-out'}>
      {!isLoggedIn && (
        <header>
          <h1>FixBo</h1>
          <p className="tagline">Let's fix it.</p>
        </header>
      )}
      {isLoggedIn ? renderCurrentPage() : <LoginPage onLogin={handleLogin} />}
    </div>
  );
}

export default App;