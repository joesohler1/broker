import React, { useState, useEffect } from 'react';
import './JobsMarketplace.css';
import Navbar from '../components/Navbar';
import dataService from '../services/dataService';

const JobsMarketplace = ({ onLogout, userData, onNavigateBack, onNavigateToJobDetails }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBudgetRange, setSelectedBudgetRange] = useState('all');

  const categories = [
    'all', 'plumbing', 'electrical', 'carpentry', 'HVAC', 
    'painting', 'landscaping', 'general', 'roofing', 'flooring'
  ];

  const budgetRanges = [
    { value: 'all', label: 'All Budgets' },
    { value: '0-100', label: '$0 - $100' },
    { value: '100-300', label: '$100 - $300' },
    { value: '300-500', label: '$300 - $500' },
    { value: '500-1000', label: '$500 - $1,000' },
    { value: '1000+', label: '$1,000+' }
  ];

  useEffect(() => {
    // Sample job postings from homeowners
    const sampleJobs = [
      {
        id: 1,
        title: "Kitchen Faucet Replacement",
        category: "plumbing",
        description: "Need to replace a leaky kitchen faucet. The current one is about 10 years old and drips constantly. Looking for a reliable handyman to do this quickly.",
        budget: 150,
        budgetType: "fixed",
        location: "Downtown Seattle, WA",
        distance: "2.3 miles",
        postedDate: "2 hours ago",
        urgency: "normal",
        homeowner: {
          name: "Sarah Johnson",
          rating: 4.8,
          completedJobs: 12,
          profileImage: "/placeholder/60/60"
        },
        requirements: [
          "Licensed plumber preferred",
          "Provide own tools",
          "Available weekends"
        ],
        images: ["kitchen-faucet-1.jpg"],
        estimatedHours: "1-2 hours"
      },
      {
        id: 2,
        title: "Bathroom Tile Repair",
        category: "general",
        description: "Several tiles in my shower are loose and need to be re-grouted. About 15 tiles total need attention. I have matching tiles available.",
        budget: 275,
        budgetType: "fixed",
        location: "Capitol Hill, Seattle, WA",
        distance: "4.1 miles",
        postedDate: "5 hours ago",
        urgency: "normal",
        homeowner: {
          name: "Mike Chen",
          rating: 4.9,
          completedJobs: 8,
          profileImage: "/placeholder/60/60"
        },
        requirements: [
          "Experience with tile work",
          "Clean up after work",
          "Flexible scheduling"
        ],
        images: ["bathroom-tiles.jpg"],
        estimatedHours: "3-4 hours"
      },
      {
        id: 3,
        title: "Ceiling Light Installation",
        category: "electrical",
        description: "Need to install 3 new LED ceiling lights in living room. Wiring is already in place, just need the fixtures installed and connected.",
        budget: 200,
        budgetType: "fixed",
        location: "Ballard, Seattle, WA",
        distance: "6.8 miles",
        postedDate: "1 day ago",
        urgency: "low",
        homeowner: {
          name: "Jennifer Williams",
          rating: 4.7,
          completedJobs: 15,
          profileImage: "/placeholder/60/60"
        },
        requirements: [
          "Licensed electrician required",
          "Provide fixtures (I have them)",
          "Evening or weekend work"
        ],
        images: ["ceiling-lights.jpg"],
        estimatedHours: "2-3 hours"
      },
      {
        id: 4,
        title: "Fence Repair - URGENT",
        category: "carpentry",
        description: "Storm damaged my fence last night. 3 panels are down and 2 posts are loose. Need this fixed ASAP as my dogs can get out.",
        budget: 450,
        budgetType: "negotiable",
        location: "Fremont, Seattle, WA",
        distance: "5.2 miles",
        postedDate: "3 hours ago",
        urgency: "urgent",
        homeowner: {
          name: "Robert Davis",
          rating: 4.6,
          completedJobs: 6,
          profileImage: "/placeholder/60/60"
        },
        requirements: [
          "Available today or tomorrow",
          "Experience with fence repair",
          "Provide materials estimate"
        ],
        images: ["fence-damage.jpg"],
        estimatedHours: "4-6 hours"
      },
      {
        id: 5,
        title: "HVAC Vent Cleaning",
        category: "HVAC",
        description: "Need all air ducts and vents cleaned in my 2-bedroom condo. Haven't been cleaned in 3 years and getting dusty.",
        budget: 320,
        budgetType: "fixed",
        location: "Queen Anne, Seattle, WA",
        distance: "3.7 miles",
        postedDate: "6 hours ago",
        urgency: "normal",
        homeowner: {
          name: "Lisa Thompson",
          rating: 5.0,
          completedJobs: 4,
          profileImage: "/placeholder/60/60"
        },
        requirements: [
          "Professional duct cleaning equipment",
          "HVAC certification preferred",
          "Weekday availability"
        ],
        images: ["hvac-vents.jpg"],
        estimatedHours: "2-3 hours"
      },
      {
        id: 6,
        title: "Deck Staining",
        category: "painting",
        description: "200 sq ft deck needs power washing and staining. Wood is in good condition, just needs refreshing for summer.",
        budget: 380,
        budgetType: "negotiable",
        location: "West Seattle, WA",
        distance: "8.1 miles",
        postedDate: "2 days ago",
        urgency: "low",
        homeowner: {
          name: "Tom Anderson",
          rating: 4.8,
          completedJobs: 11,
          profileImage: "/placeholder/60/60"
        },
        requirements: [
          "Provide stain and materials",
          "Weather-dependent scheduling",
          "Experience with deck maintenance"
        ],
        images: ["deck-staining.jpg"],
        estimatedHours: "6-8 hours"
      }
    ];

    // Replace with real data service call
    const fetchJobs = async () => {
      try {
        console.log('JobsMarketplace: Fetching jobs from dataService...');
        // Get real jobs from service requests
        const realJobs = await dataService.getJobs();
        console.log('JobsMarketplace: Retrieved jobs:', realJobs);
        setJobs(realJobs);
        setFilteredJobs(realJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // Fallback to sample data if needed
        setJobs(sampleJobs);
        setFilteredJobs(sampleJobs);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search term, category, and budget
  useEffect(() => {
    let filtered = jobs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    // Filter by budget range
    if (selectedBudgetRange !== 'all') {
      filtered = filtered.filter(job => {
        const budget = job.budget;
        switch (selectedBudgetRange) {
          case '0-100': return budget <= 100;
          case '100-300': return budget > 100 && budget <= 300;
          case '300-500': return budget > 300 && budget <= 500;
          case '500-1000': return budget > 500 && budget <= 1000;
          case '1000+': return budget > 1000;
          default: return true;
        }
      });
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedCategory, selectedBudgetRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      plumbing: '🔧',
      electrical: '⚡',
      carpentry: '🔨',
      HVAC: '🌬️',
      painting: '🎨',
      landscaping: '🌿',
      general: '🛠️',
      roofing: '🏠',
      flooring: '📐'
    };
    return icons[category] || '🛠️';
  };

  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'urgency-urgent';
      case 'normal': return 'urgency-normal';
      case 'low': return 'urgency-low';
      default: return 'urgency-normal';
    }
  };

  const handleApplyToJob = (jobId) => {
    console.log(`Applying to job ${jobId}`);
    // TODO: Add application logic
    alert('Application feature coming soon!');
  };

  const handleViewJobDetails = (job) => {
    if (onNavigateToJobDetails) {
      onNavigateToJobDetails(job);
    }
  };

  return (
    <div className="jobs-marketplace">
      <Navbar 
        onLogout={onLogout} 
        onNavigateToDashboard={onNavigateBack}
        userType="handyman"
      />
      
      <div className="jobs-marketplace-content">
        <div className="marketplace-header">
          <div className="header-main">
            <h1>Jobs Marketplace</h1>
            <p className="header-subtitle">Find your next project from homeowners in your area</p>
          </div>
          <button className="back-to-dashboard-btn" onClick={onNavigateBack}>
            ← Back to Dashboard
          </button>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search jobs by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <select 
              value={selectedBudgetRange} 
              onChange={(e) => setSelectedBudgetRange(e.target.value)}
              className="filter-select"
            >
              {budgetRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <h2>Available Jobs ({filteredJobs.length})</h2>
        </div>

        {/* Jobs List */}
        <div className="jobs-list">
          {filteredJobs.map(job => (
            <div 
              key={job.id} 
              className="job-item"
            >
              {/* Homeowner Profile Picture */}
              <div className="homeowner-avatar">
                <img 
                  src={job.homeowner.profileImage} 
                  alt={job.homeowner.name}
                  className="profile-image"
                />
              </div>

              {/* Job Info */}
              <div className="job-info">
                <div className="job-header-compact">
                  <div className="job-title-compact">
                    <span className="category-icon-small">{getCategoryIcon(job.category)}</span>
                    <h3 className="job-title-text">{job.title}</h3>
                    {job.urgency === 'urgent' && (
                      <span className="urgent-label">🚨 URGENT</span>
                    )}
                  </div>
                  <div className="job-budget-compact">
                    <span className="budget-amount-large">{formatCurrency(job.budget)}</span>
                  </div>
                </div>

                <div className="job-summary">
                  <p className="job-description-short">
                    {job.description.length > 120 
                      ? `${job.description.substring(0, 120)}...` 
                      : job.description}
                  </p>
                </div>

                <div className="job-meta-compact">
                  <div className="homeowner-info-compact">
                    <span className="homeowner-name-compact">{job.homeowner.name}</span>
                    <span className="homeowner-rating-compact">
                      ⭐ {job.homeowner.rating} • {job.homeowner.completedJobs} jobs
                    </span>
                  </div>
                  <div className="job-details-compact">
                    <span className="location-compact">📍 {job.location.split(',')[0]}</span>
                    <span className="time-compact">⏱️ {job.estimatedHours}</span>
                    <span className="posted-compact">📅 {job.postedDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="job-action">
                <button 
                  className="view-details-btn-compact"
                  onClick={() => handleViewJobDetails(job)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="no-results">
            <h3>No jobs match your criteria</h3>
            <p>Try adjusting your filters or search terms to find more opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsMarketplace;
