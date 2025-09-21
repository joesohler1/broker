import React, { useState, useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ images, onImagesChange, maxImages = 6, required = false, error }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

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
    processFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = async (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Please select image files only.');
      return;
    }

    if (images.length + imageFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images. Please remove some existing images first.`);
      return;
    }

    setUploading(true);

    try {
      const newImages = await Promise.all(
        imageFiles.map(async (file) => {
          // Check file size (limit to 5MB)
          if (file.size > 5 * 1024 * 1024) {
            throw new Error(`${file.name} is too large. Please use images under 5MB.`);
          }

          // Create preview URL
          const previewUrl = URL.createObjectURL(file);
          
          // In a real app, you would upload to a server here
          // For now, we'll simulate upload delay
          await new Promise(resolve => setTimeout(resolve, 500));

          return {
            id: Date.now() + Math.random(),
            file: file,
            previewUrl: previewUrl,
            name: file.name,
            size: file.size,
            uploaded: true
          };
        })
      );

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    
    // Clean up preview URL
    const imageToRemove = images.find(img => img.id === imageId);
    if (imageToRemove && imageToRemove.previewUrl) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }
    
    onImagesChange(updatedImages);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="image-upload">
      {/* Header Section */}
      <div className="upload-header">
        <h3>📷 Add Photos {required && <span className="required-indicator">*</span>}</h3>
        <p className="upload-description">
          Help handymen understand your project better with clear photos. 
          {required ? ' At least one photo is required.' : ' Photos are recommended for accurate estimates.'}
        </p>
      </div>

      {/* Photo Guidelines */}
      <div className="photo-guidelines">
        <h4>🎯 Photo Guidelines</h4>
        <div className="guidelines-grid">
          <div className="guideline-item">
            <span className="guideline-icon">📐</span>
            <div>
              <strong>Wide Shot</strong>
              <p>Show the overall area or room</p>
            </div>
          </div>
          <div className="guideline-item">
            <span className="guideline-icon">🔍</span>
            <div>
              <strong>Close-Up</strong>
              <p>Detail the specific problem area</p>
            </div>
          </div>
          <div className="guideline-item">
            <span className="guideline-icon">💡</span>
            <div>
              <strong>Good Lighting</strong>
              <p>Natural light works best</p>
            </div>
          </div>
          <div className="guideline-item">
            <span className="guideline-icon">🏷️</span>
            <div>
              <strong>Show Labels</strong>
              <p>Include model numbers if visible</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div 
        className={`upload-zone ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''} ${error ? 'error' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="file-input"
          disabled={uploading || images.length >= maxImages}
        />
        
        <div className="upload-content">
          {uploading ? (
            <>
              <div className="upload-spinner">⏳</div>
              <h3>Processing images...</h3>
              <p>Optimizing photos for the best quality</p>
            </>
          ) : (
            <>
              <div className="upload-icon">
                {images.length === 0 ? '📷' : '➕'}
              </div>
              <h3>
                {images.length === 0 ? 'Add Your First Photo' : 'Add More Photos'}
              </h3>
              <p>
                {images.length === 0 
                  ? 'Start by showing the overall area, then add close-up shots'
                  : 'Drag and drop additional images or click to browse'
                }
              </p>
              <div className="upload-info">
                <span>• Up to {maxImages} images</span>
                <span>• Max 5MB per image</span>
                <span>• JPG, PNG, GIF formats</span>
              </div>
              {images.length >= maxImages && (
                <div className="max-reached">
                  Maximum number of images reached
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="upload-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="image-previews">
          <div className="previews-header">
            <h4>Uploaded Images ({images.length}/{maxImages})</h4>
          </div>
          
          <div className="previews-grid">
            {images.map((image) => (
              <div key={image.id} className="image-preview">
                <div className="preview-image">
                  <img 
                    src={image.previewUrl} 
                    alt={image.name}
                    onLoad={() => {
                      // Image loaded successfully
                    }}
                    onError={() => {
                      console.error('Failed to load image preview');
                    }}
                  />
                  <button 
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
                
                <div className="image-info">
                  <div className="image-name" title={image.name}>
                    {image.name.length > 20 ? `${image.name.substring(0, 20)}...` : image.name}
                  </div>
                  <div className="image-size">
                    {formatFileSize(image.size)}
                  </div>
                  {image.uploaded && (
                    <div className="upload-status success">✓ Uploaded</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Tips */}
      <div className="upload-tips">
        <h4>� Pro Tips for Better Quotes</h4>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">🔧</span>
            <div>
              <strong>Show the Problem</strong>
              <p>Clear photos of damage, leaks, or broken items help handymen assess difficulty</p>
            </div>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📏</span>
            <div>
              <strong>Include Scale</strong>
              <p>Place a coin or ruler next to small issues to show size</p>
            </div>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🏠</span>
            <div>
              <strong>Room Context</strong>
              <p>Wide shots help handymen understand workspace and access</p>
            </div>
          </div>
          <div className="tip-card">
            <span className="tip-icon">⚡</span>
            <div>
              <strong>Safety Concerns</strong>
              <p>Document electrical panels, gas lines, or structural issues</p>
            </div>
          </div>
        </div>
        <div className="upload-benefit">
          <span className="benefit-icon">✨</span>
          <strong>Better photos = More accurate quotes = Fewer surprises!</strong>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;