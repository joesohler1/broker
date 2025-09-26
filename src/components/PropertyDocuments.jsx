import React, { useState } from 'react';
import './PropertyDocuments.css';

const PropertyDocuments = ({ propertyId }) => {
  const [documents] = useState([
    {
      id: 1,
      name: 'Property Deed',
      type: 'Legal Document',
      dateAdded: '2023-01-15',
      fileSize: '2.3 MB',
      category: 'legal',
      description: 'Official property ownership document'
    },
    {
      id: 2,
      name: 'Home Warranty Information',
      type: 'Warranty',
      dateAdded: '2023-03-22',
      fileSize: '1.1 MB',
      category: 'warranty',
      description: 'Comprehensive home warranty coverage details'
    },
    {
      id: 3,
      name: 'HVAC System Manual',
      type: 'Manual',
      dateAdded: '2023-06-10',
      fileSize: '5.2 MB',
      category: 'manual',
      description: 'Installation and maintenance manual for HVAC system'
    },
    {
      id: 4,
      name: 'Electrical Inspection Certificate',
      type: 'Certificate',
      dateAdded: '2023-08-05',
      fileSize: '0.8 MB',
      category: 'certificate',
      description: 'Annual electrical safety inspection certificate'
    },
    {
      id: 5,
      name: 'Appliance Warranties',
      type: 'Warranty',
      dateAdded: '2023-04-18',
      fileSize: '3.7 MB',
      category: 'warranty',
      description: 'Warranty information for all major appliances'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dragOver, setDragOver] = useState(false);

  const categories = [
    { id: 'all', label: 'All Documents', icon: '📄' },
    { id: 'legal', label: 'Legal', icon: '⚖️' },
    { id: 'warranty', label: 'Warranties', icon: '🛡️' },
    { id: 'manual', label: 'Manuals', icon: '📖' },
    { id: 'certificate', label: 'Certificates', icon: '🏆' },
    { id: 'photo', label: 'Photos', icon: '📸' }
  ];

  const getDocumentIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'legal document': return '⚖️';
      case 'warranty': return '🛡️';
      case 'manual': return '📖';
      case 'certificate': return '🏆';
      case 'photo': return '📸';
      case 'receipt': return '🧾';
      default: return '📄';
    }
  };

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    alert(`${files.length} file(s) ready to upload!`);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    alert(`${files.length} file(s) ready to upload!`);
  };

  return (
    <div className="property-documents">
      <div className="documents-header">
        <h3>Property Documents</h3>
        <p>Manage all your property-related documents in one place</p>
      </div>

      {/* Upload Area */}
      <div 
        className={`upload-area ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          <div className="upload-icon">📁</div>
          <h4>Upload Documents</h4>
          <p>Drag and drop files here or click to browse</p>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="file-input"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
          />
          <button className="browse-btn">Browse Files</button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            {category.label}
            {category.id !== 'all' && (
              <span className="category-count">
                {documents.filter(doc => doc.category === category.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="documents-list">
        {filteredDocuments.length === 0 ? (
          <div className="no-documents">
            <div className="no-documents-icon">📄</div>
            <h4>No documents found</h4>
            <p>Upload your first document to get started</p>
          </div>
        ) : (
          <div className="documents-grid">
            {filteredDocuments.map(document => (
              <div key={document.id} className="document-card">
                <div className="document-header">
                  <div className="document-icon">
                    {getDocumentIcon(document.type)}
                  </div>
                  <div className="document-actions">
                    <button className="action-btn view-btn" title="View">👁️</button>
                    <button className="action-btn download-btn" title="Download">⬇️</button>
                    <button className="action-btn delete-btn" title="Delete">🗑️</button>
                  </div>
                </div>
                
                <div className="document-info">
                  <h4 className="document-name">{document.name}</h4>
                  <p className="document-type">{document.type}</p>
                  <p className="document-description">{document.description}</p>
                </div>
                
                <div className="document-meta">
                  <div className="meta-item">
                    <span className="meta-label">Added:</span>
                    <span className="meta-value">{new Date(document.dateAdded).toLocaleDateString()}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Size:</span>
                    <span className="meta-value">{document.fileSize}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Actions */}
      {filteredDocuments.length > 0 && (
        <div className="documents-actions">
          <button className="bulk-action-btn">Download All</button>
          <button className="bulk-action-btn">Share Documents</button>
        </div>
      )}
    </div>
  );
};

export default PropertyDocuments;