/**
 * API Service Layer
 * This module handles all backend communication and replaces mock data
 */

const API_BASE_URL = (typeof window !== 'undefined' && window.ENV?.API_URL) || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setAuthToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Clear authentication
  clearAuth() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication Methods
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearAuth();
    }
  }

  // User Methods
  async getCurrentUser() {
    return this.request('/users/me');
  }

  async updateUser(userData) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async uploadProfileImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return this.request('/users/profile-image', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  // Job Methods
  async getJobs(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/jobs${params ? `?${params}` : ''}`);
  }

  async getJobById(jobId) {
    return this.request(`/jobs/${jobId}`);
  }

  async createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(jobId, jobData) {
    return this.request(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(jobId) {
    return this.request(`/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  // Bid Methods
  async getBidsForJob(jobId) {
    return this.request(`/jobs/${jobId}/bids`);
  }

  async createBid(jobId, bidData) {
    return this.request(`/jobs/${jobId}/bids`, {
      method: 'POST',
      body: JSON.stringify(bidData),
    });
  }

  async updateBid(bidId, bidData) {
    return this.request(`/bids/${bidId}`, {
      method: 'PUT',
      body: JSON.stringify(bidData),
    });
  }

  async acceptBid(bidId) {
    return this.request(`/bids/${bidId}/accept`, {
      method: 'POST',
    });
  }

  async rejectBid(bidId) {
    return this.request(`/bids/${bidId}/reject`, {
      method: 'POST',
    });
  }

  // Contractor-specific Methods
  async getContractorStats(contractorId) {
    return this.request(`/contractors/${contractorId}/stats`);
  }

  async getContractorProjects(contractorId, status = null) {
    const params = status ? `?status=${status}` : '';
    return this.request(`/contractors/${contractorId}/projects${params}`);
  }

  async getContractorCalendar(contractorId, startDate, endDate) {
    const params = new URLSearchParams({ startDate, endDate }).toString();
    return this.request(`/contractors/${contractorId}/calendar?${params}`);
  }

  async updateProjectStatus(projectId, status, notes = '') {
    return this.request(`/projects/${projectId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Homeowner-specific Methods
  async getHomeownerJobs(homeownerId) {
    return this.request(`/homeowners/${homeownerId}/jobs`);
  }

  async rateContractor(projectId, rating, review) {
    return this.request(`/projects/${projectId}/rating`, {
      method: 'POST',
      body: JSON.stringify({ rating, review }),
    });
  }

  // File Upload Methods
  async uploadJobImages(jobId, imageFiles) {
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append(`images`, file);
    });
    
    return this.request(`/jobs/${jobId}/images`, {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  // Search and Filter Methods
  async searchJobs(query, filters = {}) {
    const params = new URLSearchParams({ q: query, ...filters }).toString();
    return this.request(`/jobs/search?${params}`);
  }

  async getJobsByCategory(category) {
    return this.request(`/jobs?category=${category}`);
  }

  async getJobsByLocation(lat, lng, radius = 25) {
    const params = new URLSearchParams({ lat, lng, radius }).toString();
    return this.request(`/jobs/nearby?${params}`);
  }

  // Notification Methods
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;