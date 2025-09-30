import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import AccountCreationPage from './pages/AccountCreationPage';
import DashboardPage from './pages/DashboardPage';
import HandymanDashboard from './pages/HandymanDashboard';
import JobsMarketplace from './pages/JobsMarketplace';
import JobDetails from './pages/JobDetails';
import NewServiceRequestPage from './pages/NewServiceRequestPage';
import CurrentRequestsPage from './pages/CurrentRequestsPage';
import EditServiceRequestPage from './pages/EditServiceRequestPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import AppSettingsPage from './pages/AppSettingsPage';
import SetupWizard from './components/SetupWizard';
import HandymanSetupWizard from './components/HandymanSetupWizard';
import { mockProperties } from './data/mockData';
import { scrollToTop } from './utils/scrollUtils';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingRequest, setEditingRequest] = useState(null);
  const [userProperties, setUserProperties] = useState([]);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showHandymanSetupWizard, setShowHandymanSetupWizard] = useState(false);
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [userData, setUserData] = useState(null);
  const [selectedJobData, setSelectedJobData] = useState(null);

  // Check if user has completed setup on login
  useEffect(() => {
    if (isLoggedIn) {
      const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = currentUser.id;
      
      if (!userId) {
        // No user data found, go back to login
        console.error('No user ID found, redirecting to login');
        setIsLoggedIn(false);
        return;
      }
      
      // Check user-specific setup completion
      const hasCompletedSetup = localStorage.getItem(`hasCompletedSetup_${userId}`) === 'true';
      const savedProperties = JSON.parse(localStorage.getItem(`userProperties_${userId}`) || '[]');
      
      // Handle different user types
      if (currentUser.userType === 'handyman') {
        // Check if handyman has completed their professional setup
        const hasCompletedHandymanSetup = localStorage.getItem(`hasCompletedHandymanSetup_${userId}`) === 'true';
        
        if (hasCompletedHandymanSetup) {
          // Handyman has completed setup, go to dashboard
          setIsFirstTimeUser(false);
          setShowSetupWizard(false);
          setShowHandymanSetupWizard(false);
          setUserProperties([]);
          setCurrentPage('handyman-dashboard');
        } else {
          // Handyman needs to complete professional setup
          setIsFirstTimeUser(true);
          setShowSetupWizard(false);
          setShowHandymanSetupWizard(true);
          setUserProperties([]);
        }
      } else {
        // Customer flow - check if they need property setup
        if (hasCompletedSetup) {
          setIsFirstTimeUser(false);
          setUserProperties(savedProperties.length > 0 ? savedProperties : []);
          setShowSetupWizard(false);
          setShowHandymanSetupWizard(false);
        } else {
          setIsFirstTimeUser(true);
          setShowSetupWizard(true);
          setShowHandymanSetupWizard(false);
          setUserProperties([]);
        }
      }
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    
    // User data should already be set by LoginPage, but double-check
    const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (storedUserData && storedUserData.name) {
      setUserData(storedUserData);
      // Set initial page based on user type
      if (storedUserData.userType === 'handyman') {
        setCurrentPage('handyman-dashboard');
      } else {
        setCurrentPage('dashboard');
      }
    } else {
      setCurrentPage('dashboard'); // Default fallback
    }
  };

  const handleCreateAccount = () => {
    setShowAccountCreation(true);
  };

  const handleAccountCreated = (userData) => {
    // In a real app, the account would be created via API
    setShowAccountCreation(false);
    // Redirect back to login page so user goes through proper flow
    // Login → Setup Wizard → Dashboard
  };

  const handleBackToLogin = () => {
    setShowAccountCreation(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
    // Reset all state on logout
    setShowSetupWizard(false);
    setShowAccountCreation(false);
    setIsFirstTimeUser(true);
    setUserProperties([]);
    setUserData(null);
    
    // Clear current user session
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('userData');
  };

  const handleSetupComplete = (property) => {
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = currentUser.id;
    
    if (!userId) {
      console.error('No user ID found during setup completion');
      return;
    }
    
    const newProperties = [property];
    setUserProperties(newProperties);
    setShowSetupWizard(false);
    setIsFirstTimeUser(false);
    
    // Save to user-specific localStorage keys
    localStorage.setItem(`hasCompletedSetup_${userId}`, 'true');
    localStorage.setItem(`userProperties_${userId}`, JSON.stringify(newProperties));
    
    // Scroll to top before showing dashboard
    scrollToTop();
    
    setCurrentPage('dashboard');
  };

  const handleHandymanSetupComplete = (profileData) => {
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = currentUser.id;
    
    if (!userId) {
      console.error('No user ID found during handyman setup completion');
      return;
    }
    
    // Set the handyman setup completion flag
    localStorage.setItem(`hasCompletedHandymanSetup_${userId}`, 'true');
    
    setShowHandymanSetupWizard(false);
    setIsFirstTimeUser(false);
    
    // Scroll to top before showing dashboard
    scrollToTop();
    
    setCurrentPage('handyman-dashboard');
  };

  const handleHandymanSetupSkip = () => {
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = currentUser.id;
    
    if (!userId) {
      console.error('No user ID found during handyman setup skip');
      return;
    }
    
    // Also set completion flag when skipping so they don't get asked again
    localStorage.setItem(`hasCompletedHandymanSetup_${userId}`, 'true');
    
    setShowHandymanSetupWizard(false);
    setIsFirstTimeUser(false);
    
    setCurrentPage('handyman-dashboard');
  };

  const handleSetupSkip = () => {
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = currentUser.id;
    
    if (!userId) {
      console.error('No user ID found during setup skip');
      return;
    }
    
    setShowSetupWizard(false);
    setIsFirstTimeUser(false);
    
    // Mark setup as completed even if skipped using user-specific keys
    localStorage.setItem(`hasCompletedSetup_${userId}`, 'true');
    localStorage.setItem(`userProperties_${userId}`, JSON.stringify([]));
    
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

  const handleNavigateToProfile = () => {
    setCurrentPage('profile-settings');
  };

  const handleNavigateToAppSettings = () => {
    setCurrentPage('app-settings');
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
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToAppSettings={handleNavigateToAppSettings}
            userProperties={userProperties.length > 0 ? userProperties : mockProperties}
          />
        );
      case 'current-requests':
        return (
          <CurrentRequestsPage 
            onLogout={handleLogout}
            onBack={handleBackToDashboard}
            onNavigateToEdit={handleNavigateToEdit}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToAppSettings={handleNavigateToAppSettings}
          />
        );
      case 'edit-service-request':
        return (
          <EditServiceRequestPage 
            onLogout={handleLogout}
            onBack={handleBackToCurrentRequests}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToAppSettings={handleNavigateToAppSettings}
            userProperties={userProperties.length > 0 ? userProperties : mockProperties}
            requestData={editingRequest}
          />
        );
      case 'profile-settings':
        return (
          <ProfileSettingsPage
            onLogout={handleLogout}
            onBack={handleBackToDashboard}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToAppSettings={handleNavigateToAppSettings}
            userData={userData}
          />
        );
      case 'app-settings':
        return (
          <AppSettingsPage
            onLogout={handleLogout}
            onBack={handleBackToDashboard}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToAppSettings={handleNavigateToAppSettings}
          />
        );
      case 'handyman-dashboard':
        return (
          <HandymanDashboard 
            onLogout={handleLogout}
            userData={userData}
            onNavigateToJobsMarketplace={() => setCurrentPage('jobs-marketplace')}
          />
        );
      case 'jobs-marketplace':
        return (
          <JobsMarketplace 
            onLogout={handleLogout}
            userData={userData}
            onNavigateBack={() => setCurrentPage('handyman-dashboard')}
            onNavigateToJobDetails={(jobData) => {
              setSelectedJobData(jobData);
              setCurrentPage('job-details');
            }}
          />
        );
      case 'job-details':
        return (
          <JobDetails 
            onLogout={handleLogout}
            userData={userData}
            jobData={selectedJobData}
            onNavigateBack={() => setCurrentPage('handyman-dashboard')}
            onNavigateToMarketplace={() => setCurrentPage('jobs-marketplace')}
          />
        );
      case 'dashboard':
      default:
        return (
          <DashboardPage 
            onLogout={handleLogout}
            onNavigateToServiceRequest={handleNavigateToServiceRequest}
            onNavigateToCurrentRequests={handleNavigateToCurrentRequests}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToAppSettings={handleNavigateToAppSettings}
            userProperties={userProperties}
            userData={userData}
          />
        );
    }
  };

  return (
    <div className={isLoggedIn ? 'app-logged-in' : 'app-logged-out'}>
      {!isLoggedIn && !showAccountCreation && (
        <header>
          <h1>FixBo</h1>
          <p className="tagline">Let's fix it.</p>
        </header>
      )}
      {!isLoggedIn && showAccountCreation ? (
        <AccountCreationPage 
          onAccountCreated={handleAccountCreated}
          onBackToLogin={handleBackToLogin}
        />
      ) : !isLoggedIn ? (
        <LoginPage 
          onLogin={handleLogin} 
          onCreateAccount={handleCreateAccount}
        />
      ) : showHandymanSetupWizard ? (
        <HandymanSetupWizard 
          onComplete={handleHandymanSetupComplete}
          onSkip={handleHandymanSetupSkip}
          userData={userData}
        />
      ) : showSetupWizard ? (
        <SetupWizard 
          onComplete={handleSetupComplete}
          onSkip={handleSetupSkip}
        />
      ) : (
        renderCurrentPage()
      )}
    </div>
  );
}

export default App;