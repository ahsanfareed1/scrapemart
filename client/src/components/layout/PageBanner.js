import React from 'react';
import './PageBanner.css';

const PageBanner = ({ title, subtitle, icon }) => {
  return (
    <div className="page-banner">
      <div className="banner-background">
        <div className="banner-gradient"></div>
        <div className="banner-shapes">
          <div className="banner-shape banner-shape-1"></div>
          <div className="banner-shape banner-shape-2"></div>
          <div className="banner-shape banner-shape-3"></div>
          <div className="banner-shape banner-shape-4"></div>
          <div className="banner-shape banner-shape-5"></div>
        </div>
        <div className="banner-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </div>
      
      <div className="container">
        <div className="banner-content">
          {icon && <div className="banner-icon">{icon}</div>}
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default PageBanner;

