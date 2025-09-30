/**
 * Custom hooks for data fetching and state management
 * These hooks work with both local and real API data services
 */
import { useState, useEffect } from 'react';
import dataService from '../services/dataService';

// Hook for contractor dashboard data
export const useContractorDashboard = (contractorId) => {
  const [stats, setStats] = useState(null);
  const [activeProjects, setActiveProjects] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!contractorId) return;
      
      try {
        setLoading(true);
        setError(null);

        // Fetch contractor stats
        const statsData = await dataService.getContractorStats(contractorId);
        setStats(statsData);

        // Fetch active projects
        const projectsData = await dataService.getContractorProjects(contractorId, 'active');
        setActiveProjects(projectsData);

        // Fetch calendar events for current week
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        
        const calendarData = await dataService.getContractorCalendar(
          contractorId,
          startOfWeek.toISOString().split('T')[0],
          endOfWeek.toISOString().split('T')[0]
        );
        setCalendarEvents(calendarData);

      } catch (err) {
        setError(err.message);
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [contractorId]);

  return { stats, activeProjects, calendarEvents, loading, error };
};

// Hook for jobs marketplace
export const useJobsMarketplace = (filters = {}) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const jobsData = await dataService.getJobs(filters);
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  const searchJobs = async (query) => {
    try {
      const searchResults = await dataService.searchJobs(query, filters);
      setFilteredJobs(searchResults);
    } catch (err) {
      console.error('Error searching jobs:', err);
      // Fallback to client-side filtering
      const filtered = jobs.filter(job => 
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  };

  const filterJobs = (newFilters) => {
    const filtered = jobs.filter(job => {
      if (newFilters.category && job.category !== newFilters.category) return false;
      if (newFilters.budgetRange && !isJobInBudgetRange(job.budget, newFilters.budgetRange)) return false;
      if (newFilters.location && !isJobInLocation(job.location, newFilters.location)) return false;
      return true;
    });
    setFilteredJobs(filtered);
  };

  return { jobs, filteredJobs, loading, error, searchJobs, filterJobs };
};

// Hook for individual job details
export const useJobDetails = (jobId) => {
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      
      try {
        setLoading(true);
        setError(null);

        const jobData = await dataService.getJobById(jobId);
        setJob(jobData);

        const bidsData = await dataService.getBidsForJob(jobId);
        setBids(bidsData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const submitBid = async (bidData) => {
    try {
      const newBid = await dataService.createBid(jobId, bidData);
      setBids(prevBids => [...prevBids, newBid]);
      return newBid;
    } catch (err) {
      console.error('Error submitting bid:', err);
      throw err;
    }
  };

  const toggleLike = async (userId) => {
    // This would be replaced with proper API call
    // For now, using localStorage as fallback
    try {
      const userLikes = JSON.parse(localStorage.getItem(`userLikes_${userId}`) || '[]');
      const isLiked = userLikes.includes(jobId);
      
      if (isLiked) {
        const updatedLikes = userLikes.filter(id => id !== jobId);
        localStorage.setItem(`userLikes_${userId}`, JSON.stringify(updatedLikes));
      } else {
        const updatedLikes = [...userLikes, jobId];
        localStorage.setItem(`userLikes_${userId}`, JSON.stringify(updatedLikes));
      }
      
      return !isLiked;
    } catch (err) {
      console.error('Error toggling like:', err);
      throw err;
    }
  };

  return { job, bids, loading, error, submitBid, toggleLike };
};

// Hook for user authentication state
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const userData = await dataService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        if (dataService.clearAuth) dataService.clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await dataService.login(email, password);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (dataService.logout) await dataService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return { user, loading, error, login, logout };
};

// Helper functions
const isJobInBudgetRange = (budget, range) => {
  const [min, max] = range.split('-').map(v => v.replace('$', '').replace('+', '999999'));
  return budget >= parseInt(min) && budget <= parseInt(max);
};

const isJobInLocation = (jobLocation, filterLocation) => {
  // Simple distance calculation - in production, use proper geolocation API
  return jobLocation.city.toLowerCase().includes(filterLocation.toLowerCase());
};