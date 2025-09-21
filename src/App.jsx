import { useState } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewServiceRequestPage from './pages/NewServiceRequestPage';
import { mockProperties } from './data/mockData';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

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
      case 'dashboard':
      default:
        return (
          <DashboardPage 
            onLogout={handleLogout}
            onNavigateToServiceRequest={handleNavigateToServiceRequest}
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