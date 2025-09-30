/**
 * Data Models for the Contractor/Homeowner Platform
 * These interfaces define the structure of data exchanged with the backend API
 */

// User Types
export const UserRole = {
  HOMEOWNER: 'homeowner',
  CONTRACTOR: 'contractor'
};

// Job Categories
export const JobCategory = {
  PLUMBING: 'plumbing',
  ELECTRICAL: 'electrical',
  CARPENTRY: 'carpentry',
  HVAC: 'hvac',
  PAINTING: 'painting',
  LANDSCAPING: 'landscaping',
  GENERAL: 'general'
};

// Job Status
export const JobStatus = {
  POSTED: 'posted',
  IN_BIDDING: 'in_bidding',
  AWARDED: 'awarded',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Bid Status
export const BidStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn'
};

/**
 * User Profile Structure
 */
export const createUserProfile = () => ({
  id: null,
  email: '',
  name: '',
  role: '', // UserRole
  phone: '',
  profileImage: null,
  location: {
    address: '',
    city: '',
    state: '',
    zipCode: '',
    coordinates: { lat: null, lng: null }
  },
  createdAt: null,
  updatedAt: null,
  // Contractor-specific fields
  skills: [], // Array of JobCategory
  hourlyRate: null,
  bio: '',
  licenseNumber: '',
  insuranceVerified: false,
  rating: null,
  completedJobs: 0,
  // Homeowner-specific fields
  properties: [] // Array of Property objects
});

/**
 * Job Posting Structure
 */
export const createJobPosting = () => ({
  id: null,
  title: '',
  description: '',
  category: '', // JobCategory
  status: JobStatus.POSTED,
  budget: null,
  budgetType: 'fixed', // 'fixed' or 'hourly'
  location: {
    address: '',
    city: '',
    state: '',
    zipCode: '',
    coordinates: { lat: null, lng: null }
  },
  estimatedHours: '',
  urgency: 'normal', // 'low', 'normal', 'high', 'urgent'
  requirements: [], // Array of strings
  images: [], // Array of image URLs
  homeowner: null, // User object
  bids: [], // Array of Bid objects
  assignedContractor: null, // User object when job is awarded
  createdAt: null,
  updatedAt: null,
  completedAt: null
});

/**
 * Bid Structure
 */
export const createBid = () => ({
  id: null,
  jobId: null,
  contractorId: null,
  contractor: null, // User object
  amount: null,
  estimatedHours: null,
  message: '',
  status: BidStatus.PENDING,
  createdAt: null,
  updatedAt: null
});

/**
 * Project Structure (Active/Completed Jobs for Contractors)
 */
export const createProject = () => ({
  id: null,
  job: null, // Job object
  contractor: null, // User object
  homeowner: null, // User object
  startDate: null,
  completedDate: null,
  actualHours: null,
  actualCost: null,
  status: '', // JobStatus
  notes: '',
  rating: null, // Homeowner rating of contractor
  review: '', // Homeowner review text
  createdAt: null,
  updatedAt: null
});

/**
 * Calendar Event Structure
 */
export const createCalendarEvent = () => ({
  id: null,
  contractorId: null,
  jobId: null,
  title: '',
  category: '', // JobCategory
  date: null,
  startTime: null,
  endTime: null,
  location: '',
  client: '', // Homeowner name
  status: 'scheduled', // 'scheduled', 'in_progress', 'completed'
  notes: ''
});

/**
 * Contractor Stats Structure
 */
export const createContractorStats = () => ({
  contractorId: null,
  totalEarnings: 0,
  completedJobs: 0,
  activeJobs: 0,
  avgRating: 0,
  bidAccuracy: 0, // Percentage of bids that match actual costs
  timeEfficiency: 0, // Percentage of jobs completed on time
  weeklyEarnings: 0,
  monthlyEarnings: 0,
  yearlyEarnings: 0
});