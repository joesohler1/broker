import React, { useState, useEffect } from 'react';
import './JobDetails.css';
import Navbar from '../components/Navbar';

const JobDetails = ({ onLogout, userData, jobData, onNavigateBack, onNavigateToMarketplace }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [showBidForm, setShowBidForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasSubmittedBid, setHasSubmittedBid] = useState(false);

  useEffect(() => {
    // Increment view counter when job is viewed
    if (jobData) {
      const jobId = jobData.id;
      const currentViews = localStorage.getItem(`jobViews_${jobId}`) || '0';
      const newViewCount = parseInt(currentViews) + 1;
      setViewCount(newViewCount);
      localStorage.setItem(`jobViews_${jobId}`, newViewCount.toString());

      // Check if user has liked this job
      const userLikes = JSON.parse(localStorage.getItem(`userLikes_${userData?.id}`) || '[]');
      setIsLiked(userLikes.includes(jobId));

      // Check if user has already bid on this job
      const userBids = JSON.parse(localStorage.getItem(`userBids_${userData?.id}`) || '[]');
      setHasSubmittedBid(userBids.includes(jobId));
    }
  }, [jobData, userData]);

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

  const handleLikeToggle = () => {
    const jobId = jobData.id;
    const userLikes = JSON.parse(localStorage.getItem(`userLikes_${userData?.id}`) || '[]');
    
    let updatedLikes;
    if (isLiked) {
      // Remove like
      updatedLikes = userLikes.filter(id => id !== jobId);
    } else {
      // Add like
      updatedLikes = [...userLikes, jobId];
    }
    
    localStorage.setItem(`userLikes_${userData?.id}`, JSON.stringify(updatedLikes));
    setIsLiked(!isLiked);
  };

  const handleSubmitBid = (e) => {
    e.preventDefault();
    
    if (!bidAmount || !bidMessage || !estimatedHours) {
      alert('Please fill in all bid details.');
      return;
    }

    const bid = {
      jobId: jobData.id,
      contractorId: userData?.id,
      contractorName: userData?.name || 'Professional Contractor',
      amount: parseFloat(bidAmount),
      message: bidMessage,
      estimatedHours: estimatedHours,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    // Save bid to localStorage (in real app, this would go to a server)
    const jobBids = JSON.parse(localStorage.getItem(`jobBids_${jobData.id}`) || '[]');
    jobBids.push(bid);
    localStorage.setItem(`jobBids_${jobData.id}`, JSON.stringify(jobBids));

    // Track that user has bid on this job
    const userBids = JSON.parse(localStorage.getItem(`userBids_${userData?.id}`) || '[]');
    userBids.push(jobData.id);
    localStorage.setItem(`userBids_${userData?.id}`, JSON.stringify(userBids));

    setHasSubmittedBid(true);
    setShowBidForm(false);
    
    alert('Your bid has been submitted successfully! The homeowner will review and get back to you.');
  };

  const handleContactHomeowner = () => {
    alert('Messaging feature coming soon! For now, your interest has been noted.');
  };

  const nextImage = () => {
    if (jobData?.images && jobData.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % jobData.images.length);
    }
  };

  const prevImage = () => {
    if (jobData?.images && jobData.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + jobData.images.length) % jobData.images.length);
    }
  };

  const getSampleImages = () => {
    // Sample images for demonstration
    const sampleImages = [
      '/placeholder/600/400',
      '/placeholder/600/400',
      '/placeholder/600/400'
    ];
    return sampleImages;
  };

  if (!jobData) {
    return (
      <div className="job-details">
        <Navbar 
          onLogout={onLogout} 
          onNavigateToDashboard={onNavigateBack}
          userType="handyman"
        />
        <div className="job-details-content">
          <div className="error-message">
            <h2>Job not found</h2>
            <p>The job you're looking for doesn't exist or has been removed.</p>
            <button className="back-btn" onClick={onNavigateToMarketplace}>
              ← Back to Jobs Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayImages = jobData.images || getSampleImages();

  return (
    <div className="job-details">
      <Navbar 
        onLogout={onLogout} 
        onNavigateToDashboard={onNavigateBack}
        userType="handyman"
      />
      
      <div className="job-details-content">
        {/* Header with navigation */}
        <div className="job-details-header">
          <button className="back-to-marketplace-btn" onClick={onNavigateToMarketplace}>
            ← Back to Jobs Marketplace
          </button>
          <div className="job-stats">
            <span className="view-count">👁️ {viewCount} views</span>
            <button 
              className={`like-button ${isLiked ? 'liked' : ''}`}
              onClick={handleLikeToggle}
            >
              {isLiked ? '❤️' : '🤍'} {isLiked ? 'Liked' : 'Like'}
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="job-main-content">
          {/* Left Column - Images */}
          <div className="job-images-section">
            <div className="image-gallery">
              <div className="main-image-container">
                <img 
                  src={displayImages[currentImageIndex]} 
                  alt={`${jobData.title} - Image ${currentImageIndex + 1}`}
                  className="main-image"
                />
                {displayImages.length > 1 && (
                  <>
                    <button className="image-nav prev" onClick={prevImage}>‹</button>
                    <button className="image-nav next" onClick={nextImage}>›</button>
                  </>
                )}
              </div>
              {displayImages.length > 1 && (
                <div className="image-thumbnails">
                  {displayImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Job Details */}
          <div className="job-info-section">
            {/* Job Header */}
            <div className="job-header">
              <div className="job-title-section">
                <span className="category-icon">{getCategoryIcon(jobData.category)}</span>
                <h1 className="job-title">{jobData.title}</h1>
                <span className={`urgency-badge ${getUrgencyClass(jobData.urgency)}`}>
                  {jobData.urgency === 'urgent' && '🚨 URGENT'}
                  {jobData.urgency === 'normal' && '⏰ Normal Priority'}
                  {jobData.urgency === 'low' && '📅 Flexible Timing'}
                </span>
              </div>
              
              <div className="job-budget-large">
                <span className="budget-amount">{formatCurrency(jobData.budget)}</span>
                <span className="budget-type">{jobData.budgetType}</span>
              </div>
            </div>

            {/* Job Meta Info */}
            <div className="job-meta-large">
              <div className="meta-grid">
                <div className="meta-item">
                  <span className="meta-icon">📍</span>
                  <div>
                    <strong>Location</strong>
                    <span>{jobData.location}</span>
                    <span className="distance">({jobData.distance} away)</span>
                  </div>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">⏱️</span>
                  <div>
                    <strong>Estimated Time</strong>
                    <span>{jobData.estimatedHours}</span>
                  </div>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">📅</span>
                  <div>
                    <strong>Posted</strong>
                    <span>{jobData.postedDate}</span>
                  </div>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">📂</span>
                  <div>
                    <strong>Category</strong>
                    <span className="category-name">{jobData.category}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="job-description-section">
              <h3>Job Description</h3>
              <p className="job-description-full">{jobData.description}</p>
            </div>

            {/* Requirements */}
            <div className="job-requirements-section">
              <h3>Requirements</h3>
              <ul className="requirements-list">
                {jobData.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Homeowner Info */}
            <div className="homeowner-info-detailed">
              <h3>About the Homeowner</h3>
              <div className="homeowner-card">
                <div className="homeowner-avatar">👤</div>
                <div className="homeowner-details">
                  <h4>{jobData.homeowner.name}</h4>
                  <div className="homeowner-rating">
                    <span className="rating">⭐ {jobData.homeowner.rating}</span>
                    <span className="job-count">({jobData.homeowner.completedJobs} completed jobs)</span>
                  </div>
                  <p className="member-since">Member since 2023</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="job-actions-section">
              {hasSubmittedBid ? (
                <div className="bid-submitted">
                  <div className="success-message">
                    <span className="success-icon">✅</span>
                    <strong>Bid Submitted!</strong>
                    <p>Your bid is being reviewed by the homeowner. You'll be notified of their decision.</p>
                  </div>
                  <button className="contact-btn-large" onClick={handleContactHomeowner}>
                    💬 Message Homeowner
                  </button>
                </div>
              ) : (
                <div className="action-buttons">
                  <button 
                    className="submit-bid-btn"
                    onClick={() => setShowBidForm(true)}
                  >
                    📋 Submit Bid
                  </button>
                  <button className="contact-btn-large" onClick={handleContactHomeowner}>
                    💬 Contact Homeowner
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bid Form Modal */}
        {showBidForm && (
          <div className="bid-modal-overlay">
            <div className="bid-modal">
              <div className="bid-modal-header">
                <h2>Submit Your Bid</h2>
                <button className="close-modal" onClick={() => setShowBidForm(false)}>✕</button>
              </div>
              
              <form onSubmit={handleSubmitBid} className="bid-form">
                <div className="form-group">
                  <label htmlFor="bidAmount">Your Bid Amount</label>
                  <div className="currency-input">
                    <span>$</span>
                    <input
                      type="number"
                      id="bidAmount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <small>Homeowner's budget: {formatCurrency(jobData.budget)} ({jobData.budgetType})</small>
                </div>

                <div className="form-group">
                  <label htmlFor="estimatedHours">Estimated Hours</label>
                  <input
                    type="text"
                    id="estimatedHours"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
                    placeholder="e.g., 2-3 hours"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bidMessage">Message to Homeowner</label>
                  <textarea
                    id="bidMessage"
                    value={bidMessage}
                    onChange={(e) => setBidMessage(e.target.value)}
                    placeholder="Introduce yourself and explain why you're the right fit for this job..."
                    rows="4"
                    required
                  />
                </div>

                <div className="bid-form-actions">
                  <button type="button" className="cancel-bid-btn" onClick={() => setShowBidForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-bid-btn">
                    Submit Bid
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
