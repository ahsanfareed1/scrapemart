import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import './PageTransition.css';

const PageTransition = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsLoading(true);
      setShowContent(false);
      
      // Show loading animation for 800ms
      setTimeout(() => {
        setIsLoading(false);
        setShowContent(true);
      }, 800);
    };

    // Listen for route changes
    window.addEventListener('beforeunload', handleRouteChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleRouteChange);
    };
  }, []);

  return (
    <div className="page-transition-container">
      {isLoading && (
        <div className="page-transition-loader">
          <div className="star-loader">
            <Star size={48} className="star-icon" />
            <div className="star-particles">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
              <div className="particle particle-4"></div>
              <div className="particle particle-5"></div>
            </div>
          </div>
          <p className="loading-text">Loading...</p>
        </div>
      )}
      
      <div className={`page-content ${showContent ? 'show' : 'hide'}`}>
        {children}
      </div>
    </div>
  );
};

export default PageTransition;
