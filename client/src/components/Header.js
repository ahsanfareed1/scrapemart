import React, { useState } from 'react';
import { Star, Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src="/white_logo.png" alt="Shopify Scraper" className="logo-image" />
        </div>
        
        <nav className="nav desktop-only">
          <a href="#try" className="nav-link new-badge">
            TRY IT NOW
            <span className="badge">NEW</span>
          </a>
          <a href="#features" className="nav-link">FEATURES</a>
          <a href="#pricing" className="nav-link">PRICING</a>
          <a href="#how-it-works" className="nav-link">HOW IT WORKS?</a>
        </nav>
        
        <div className="header-actions desktop-only">
          <a href="#signin" className="nav-link">SIGN IN</a>
          <button className="upgrade-btn">
            <Star size={16} />
            UPGRADE NOW
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button className="hamburger-btn mobile-only" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}>
        <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <div className="logo">
              <img src="/white_logo.png" alt="Shopify Scraper" className="logo-image" />
            </div>
            <button className="close-btn" onClick={closeMenu}>
              <X size={24} />
            </button>
          </div>
          
          <nav className="mobile-nav">
            <a href="#try" className="mobile-nav-link new-badge" onClick={closeMenu}>
              TRY IT NOW
              <span className="badge">NEW</span>
            </a>
            <a href="#features" className="mobile-nav-link" onClick={closeMenu}>FEATURES</a>
            <a href="#pricing" className="mobile-nav-link" onClick={closeMenu}>PRICING</a>
            <a href="#how-it-works" className="mobile-nav-link" onClick={closeMenu}>HOW IT WORKS?</a>
          </nav>
          
          <div className="mobile-actions">
            <a href="#signin" className="mobile-signin-btn" onClick={closeMenu}>SIGN IN</a>
            <button className="mobile-upgrade-btn" onClick={closeMenu}>
              <Star size={16} />
              UPGRADE NOW
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
