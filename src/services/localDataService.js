/**
 * Local Development Data Service
 * Mimics API structure but uses localStorage for fast local development
 * Easy to swap with real API calls later
 */

class LocalDataService {
  constructor() {
    this.initializeSampleData();
  }

  // Initialize with rich sample data for development
  initializeSampleData() {
    if (!localStorage.getItem('localJobs')) {
      const sampleJobs = [
        {
          id: 1,
          title: "Kitchen Faucet Replacement",
          category: "plumbing",
          description: "Need to replace a leaky kitchen faucet. The current one is about 10 years old and drips constantly.",
          budget: 150,
          budgetType: "fixed",
          location: { city: "Seattle", state: "WA", address: "Downtown Seattle" },
          distance: "2.3 miles",
          postedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          urgency: "normal",
          homeowner: {
            name: "Sarah Johnson",
            rating: 4.8,
            completedJobs: 12,
            profileImage: "/placeholder/60/60"
          },
          requirements: ["Licensed plumber preferred", "Provide own tools", "Available weekends"],
          images: ["kitchen-faucet-1.jpg"],
          estimatedHours: "1-2 hours",
          status: "posted"
        },
        {
          id: 2,
          title: "Bathroom Tile Repair",
          category: "general",
          description: "Several tiles in my shower are loose and need to be re-grouted. About 15 tiles total need attention.",
          budget: 275,
          budgetType: "fixed",
          location: { city: "Bellevue", state: "WA", address: "Bellevue Hills" },
          distance: "4.1 miles",
          postedDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          urgency: "normal",
          homeowner: {
            name: "Mike Chen",
            rating: 4.9,
            completedJobs: 8,
            profileImage: "/placeholder/60/60"
          },
          requirements: ["Experience with tile work", "Bring grout materials"],
          images: ["bathroom-tiles-1.jpg"],
          estimatedHours: "3-4 hours",
          status: "posted"
        }
        // Add more sample jobs...
      ];
      
      localStorage.setItem('localJobs', JSON.stringify(sampleJobs));
    }

    if (!localStorage.getItem('contractorStats')) {
      const sampleStats = {
        totalEarnings: 2847.50,
        completedJobs: 12,
        activeJobs: 2,
        avgRating: 4.8,
        bidAccuracy: 89,
        timeEfficiency: 94,
        weeklyEarnings: 485
      };
      localStorage.setItem('contractorStats', JSON.stringify(sampleStats));
    }
  }

  // Simulate API delay for more realistic testing
  async delay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Jobs API methods - get real homeowner service requests
  async getJobs(filters = {}) {
    await this.delay();
    
    console.log('LocalDataService: Getting jobs...');
    
    // Debug: Check what's in localStorage
    console.log('LocalDataService: Available localStorage keys:', Object.keys(localStorage));
    
    // Get all service requests from all homeowners
    const allJobs = [];
    
    // Check both localStorage keys where users might be stored
    const usersFromUsersKey = JSON.parse(localStorage.getItem('users') || '[]');
    const allUsersData = JSON.parse(localStorage.getItem('allUsers') || '{}');
    
    // Convert allUsers object to array if needed
    const usersFromAllUsersKey = Array.isArray(allUsersData) ? allUsersData : Object.values(allUsersData);
    
    // Combine all users from both keys
    const allUsers = [...usersFromUsersKey, ...usersFromAllUsersKey];
    
    console.log('LocalDataService: Users from "users" key:', usersFromUsersKey.length);
    console.log('LocalDataService: Users from "allUsers" key:', usersFromAllUsersKey.length); 
    console.log('LocalDataService: All users found:', allUsers.length, allUsers);
    
    allUsers.forEach(user => {
      console.log(`LocalDataService: Checking user - Name: ${user.name}, UserType: ${user.userType}, ID: ${user.id}`);
      
      // Check if user is a homeowner (including users with undefined userType)
      if (user.userType === 'homeowner' || user.userType === 'customer' || 
          (!user.userType && user.userType !== 'handyman')) {
        console.log(`LocalDataService: ✅ Processing homeowner: ${user.name}`);
        const serviceRequestsKey = `serviceRequests_${user.id}`;
        console.log(`LocalDataService: Looking for key: ${serviceRequestsKey}`);
        const userRequests = JSON.parse(localStorage.getItem(serviceRequestsKey) || '[]');
        console.log(`LocalDataService: User ${user.name || 'Unknown'} (ID: ${user.id}) has ${userRequests.length} requests:`, userRequests);
        
        userRequests.forEach(request => {
          console.log(`LocalDataService: Processing request "${request.title}" with status: ${request.status}`);
          if (request.status === 'Open' || request.status === 'Pending') {
            // Convert homeowner service request to contractor job format
            const job = {
              id: request.id,
              title: request.title,
              category: request.category?.toLowerCase() || 'general',
              description: request.description,
              budget: this.parseBudget(request.budget),
              budgetType: "fixed",
              location: this.formatLocation(request.property, user),
              distance: "2.3 miles", // TODO: Calculate real distance
              postedDate: this.formatPostedDate(request.dateCreated),
              urgency: request.priority === 'high' ? 'urgent' : request.priority || 'normal',
              homeowner: {
                id: user.id,
                name: user.name || 'Homeowner',
                rating: user.rating || 4.5,
                completedJobs: user.completedJobs || 5,
                profileImage: user.profileImage || "/placeholder/60/60"
              },
              requirements: request.requirements || [],
              images: request.images || [],
              estimatedHours: request.timeline || "2-4 hours",
              status: 'posted',
              originalRequest: request // Keep reference to original
            };
            allJobs.push(job);
          }
        });
      }
    });
    
    // Add sample jobs if no real jobs exist (for demo purposes)
    if (allJobs.length === 0) {
      console.log('LocalDataService: No real jobs found, adding sample jobs');
      allJobs.push(...this.getSampleJobs());
    }
    
    console.log('LocalDataService: Total jobs found:', allJobs.length, allJobs);
    
    // Apply filters
    if (Object.keys(filters).length === 0) return allJobs;
    
    return allJobs.filter(job => {
      if (filters.category && job.category !== filters.category) return false;
      if (filters.location && !job.location.includes(filters.location)) return false;
      return true;
    });
  }

  // Helper methods for data conversion
  parseBudget(budgetStr) {
    if (!budgetStr) return 200;
    const match = budgetStr.match(/\$(\d+)/);
    return match ? parseInt(match[1]) : 200;
  }
  
  formatLocation(propertyId, user) {
    // TODO: Look up property details from user properties
    return user.city || user.location || "Seattle, WA";
  }
  
  formatPostedDate(dateCreated) {
    if (!dateCreated) return "1 hour ago";
    const diff = Date.now() - new Date(dateCreated).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours === 1) return "1 hour ago";
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
  
  getSampleJobs() {
    return [
      {
        id: 999,
        title: "Sample: Kitchen Faucet Replacement",
        category: "plumbing",
        description: "This is a sample job for demonstration. Create a service request as a homeowner to see real jobs here!",
        budget: 150,
        budgetType: "fixed",
        location: "Demo Location",
        distance: "2.3 miles",
        postedDate: "2 hours ago",
        urgency: "normal",
        homeowner: {
          id: 'demo',
          name: "Demo Homeowner",
          rating: 4.8,
          completedJobs: 12,
          profileImage: "/placeholder/60/60"
        },
        requirements: ["This is a demo job"],
        images: [],
        estimatedHours: "1-2 hours",
        status: "posted"
      }
    ];
  }

  async getJobById(jobId) {
    await this.delay();
    const jobs = JSON.parse(localStorage.getItem('localJobs') || '[]');
    return jobs.find(job => job.id === parseInt(jobId));
  }

  async searchJobs(query, filters = {}) {
    await this.delay();
    const jobs = await this.getJobs(filters);
    
    return jobs.filter(job => 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Contractor stats
  async getContractorStats(contractorId) {
    await this.delay();
    // contractorId will be used when connecting to real API
    return JSON.parse(localStorage.getItem('contractorStats') || '{}');
  }

  async getContractorProjects(contractorId, status = null) {
    await this.delay();
    const projects = [
      {
        id: 1,
        title: "Deck Staining",
        category: "painting",
        client: "Johnson Family",
        startDate: "2024-09-25",
        status: "in_progress",
        budget: 850,
        estimatedHours: 6,
        actualHours: 4.5
      },
      {
        id: 2,
        title: "Fence Repair",
        category: "carpentry", 
        client: "Smith Residence",
        startDate: "2024-09-20",
        status: "completed",
        budget: 320,
        estimatedHours: 3,
        actualHours: 2.8
      }
    ];
    
    return status ? projects.filter(p => p.status === status) : projects;
  }

  // eslint-disable-next-line no-unused-vars
  async getContractorCalendar(contractorId, startDate, endDate) {
    await this.delay();
    // Parameters will be used when connecting to real API
    return [
      { id: 1, title: "Faucet Install", category: "plumbing", date: "2024-09-30", client: "Sarah J." },
      { id: 2, title: "Tile Repair", category: "general", date: "2024-10-01", client: "Mike C." },
      { id: 3, title: "Paint Touch-up", category: "painting", date: "2024-10-02", client: "Lisa M." },
      { id: 4, title: "Outlet Install", category: "electrical", date: "2024-10-03", client: "David K." }
    ];
  }

  // Bid methods
  async getBidsForJob(jobId) {
    await this.delay();
    const bids = JSON.parse(localStorage.getItem(`jobBids_${jobId}`) || '[]');
    return bids;
  }

  async createBid(jobId, bidData) {
    await this.delay();
    
    // Store bid in job-specific storage
    const bids = JSON.parse(localStorage.getItem(`jobBids_${jobId}`) || '[]');
    const newBid = {
      id: Date.now(),
      jobId: parseInt(jobId),
      contractorId: bidData.contractorId,
      contractor: bidData.contractor,
      amount: bidData.amount,
      estimatedHours: bidData.estimatedHours,
      message: bidData.message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    bids.push(newBid);
    localStorage.setItem(`jobBids_${jobId}`, JSON.stringify(bids));
    
    // Also update the original service request with bid notification
    await this.addBidToServiceRequest(jobId, newBid);
    
    return newBid;
  }
  
  async addBidToServiceRequest(jobId, bid) {
    // Find the original service request and add bid to it
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    for (let user of allUsers) {
      if (user.userType === 'homeowner' || user.userType === 'customer') {
        const userRequests = JSON.parse(localStorage.getItem(`serviceRequests_${user.id}`) || '[]');
        const requestIndex = userRequests.findIndex(req => req.id === jobId);
        
        if (requestIndex !== -1) {
          if (!userRequests[requestIndex].bids) {
            userRequests[requestIndex].bids = [];
          }
          userRequests[requestIndex].bids.push(bid);
          userRequests[requestIndex].status = 'Active'; // Update status to show bids received
          localStorage.setItem(`serviceRequests_${user.id}`, JSON.stringify(userRequests));
          break;
        }
      }
    }
  }

  // Get homeowner's service requests with bids
  async getHomeownerServiceRequests(homeownerId) {
    await this.delay();
    const userRequests = JSON.parse(localStorage.getItem(`serviceRequests_${homeownerId}`) || '[]');
    
    // Add bid information to each request
    for (let request of userRequests) {
      const bids = JSON.parse(localStorage.getItem(`jobBids_${request.id}`) || '[]');
      request.bids = bids;
      request.bidCount = bids.length;
    }
    
    return userRequests;
  }

  // User preferences (likes, etc.)
  async toggleJobLike(userId, jobId) {
    await this.delay();
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
  }
}

// Export singleton instance that can be easily swapped with real API
const dataService = new LocalDataService();
export default dataService;