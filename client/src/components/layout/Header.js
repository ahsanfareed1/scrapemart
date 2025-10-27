import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Database, Layers, Menu, X, Star } from 'lucide-react';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleMegaMenuEnter = () => {
    setShowMegaMenu(true);
  };

  const handleMegaMenuLeave = () => {
    // Add a small delay to prevent jerky behavior
    setTimeout(() => {
      setShowMegaMenu(false);
    }, 150);
  };

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 8);
      
      // Always show at the top of the page
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else {
        // Determine scroll direction when past 100px
        if (currentScrollY < lastScrollY.current) {
          // Scrolling up
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY.current) {
          // Scrolling down
          setIsVisible(false);
        }
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : 'transparent'} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="container">
        <div className="header-content">
          <img 
            src="/white_logo.png" 
            alt="ScrapeMart" 
            className="logo" 
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          />
          
          <nav className="nav-links desktop-only">
            <a href="/features">Features</a>
            <a href="/how-it-works">How It Works</a>
            
            <div 
              className={`nav-dropdown ${showMegaMenu ? 'open' : ''}`}
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
              onFocus={handleMegaMenuEnter}
              onBlur={handleMegaMenuLeave}
            >
              <button className="nav-dropdown-trigger">
                <span>Scrapers</span>
                <ChevronDown size={16} />
              </button>
              
              <div className="mega-menu" role="menu" aria-hidden={!showMegaMenu}>
                <div className="mega-menu-content">
                  <a href="/shopify-scraper" className="mega-menu-item">
                    <div className="mega-menu-icon">
                      <Database size={24} />
                    </div>
                    <div>
                      <h4>Shopify Scraper</h4>
                      <p>Extract data from any Shopify store</p>
                    </div>
                  </a>
                  <a href="/woocommerce-scraper" className="mega-menu-item">
                    <div className="mega-menu-icon">
                      <Layers size={24} />
                    </div>
                    <div>
                      <h4>WooCommerce Scraper</h4>
                      <p>Scrape WooCommerce stores easily</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
            <a href="/pricing">Pricing</a>
            <a href="/faq">FAQ</a>
            <a href="/contact">Contact</a>
            
            <div className="nav-buttons">
              <button onClick={() => navigate('/signin')} className="btn-secondary">Sign In</button>
              <button onClick={() => navigate('/signup')} className="btn-primary">Start for free</button>
            </div>
          </nav>

          {/* Mobile Hamburger Button - hide when menu is open to avoid duplicate close icon */}
          {!isMenuOpen && (
            <button className="hamburger-btn mobile-only" onClick={toggleMenu}>
              <Menu size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}>
        <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <img 
              src="/white_logo.png" 
              alt="ScrapeMart" 
              className="logo-image"
              onClick={() => { navigate('/'); closeMenu(); }}
              style={{ cursor: 'pointer' }}
            />
            <button className="close-btn" onClick={closeMenu}>
              <X size={24} />
            </button>
          </div>
          
          <nav className="mobile-nav">
            <a href="/features" className="mobile-nav-link" onClick={closeMenu}>Features</a>
            <a href="/how-it-works" className="mobile-nav-link" onClick={closeMenu}>How It Works</a>
            <a href="/shopify-scraper" className="mobile-nav-link" onClick={closeMenu}>
              <Database size={20} />
              Shopify Scraper
            </a>
            <a href="/woocommerce-scraper" className="mobile-nav-link" onClick={closeMenu}>
              <Layers size={20} />
              WooCommerce Scraper
            </a>
            <a href="/pricing" className="mobile-nav-link" onClick={closeMenu}>Pricing</a>
            <a href="/faq" className="mobile-nav-link" onClick={closeMenu}>FAQ</a>
            <a href="/contact" className="mobile-nav-link" onClick={closeMenu}>Contact</a>
          </nav>
          
          <div className="mobile-actions">
            <button onClick={() => { navigate('/signin'); closeMenu(); }} className="mobile-signin-btn">Sign In</button>
            <button onClick={() => { navigate('/signup'); closeMenu(); }} className="mobile-upgrade-btn">
              <Star size={16} />
              Start for free
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

