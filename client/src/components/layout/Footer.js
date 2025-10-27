import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Shield
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-column company-info">
            <img src="/white-logo.png" alt="ScrapeMart" className="footer-logo" />
            <p className="company-description">
              The most powerful Shopify & WooCommerce scraping tool. Extract thousands of products 
              in minutes with advanced filtering, automatic formatting, and zero coding required.
            </p>

            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li><a href="/#features">Features</a></li>
              <li><a href="/#pricing">Pricing</a></li>
              <li><a href="/#how-it-works">How It Works</a></li>
              <li><a href="/#faq">FAQ</a></li>
              <li><a href="/#demo">Live Demo</a></li>
            </ul>
          </div>

          {/* Scrapers */}
          <div className="footer-column">
            <h4>Scrapers</h4>
            <ul>
              <li><a href="/shopify-scraper">Shopify Scraper</a></li>
              <li><a href="/woocommerce-scraper">WooCommerce Scraper</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/documentation">Documentation</a></li>
              <li><a href="/tutorials">Tutorials</a></li>
              <li><a href="/case-studies">Case Studies</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-column contact-info">
            <h4>Contact Us</h4>
            <div className="contact-item">
              <Mail size={18} />
              <div>
                <span className="contact-label">Email</span>
                <a href="mailto:support@scrapemart.com">support@scrapemart.com</a>
              </div>
            </div>
            <div className="contact-item">
              <Phone size={18} />
              <div>
                <span className="contact-label">Phone</span>
                <a href="tel:+1-555-0123">+1 (555) 012-3456</a>
              </div>
            </div>
            <div className="contact-item">
              <Clock size={18} />
              <div>
                <span className="contact-label">Support</span>
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-bottom-left">
              <p>&copy; 2025 ScrapeMart. All rights reserved.</p>
              <div className="footer-links">
                <a href="/terms">Terms of Service</a>
                <a href="/acceptable-use">Acceptable Use</a>
                <a href="/privacy">Privacy</a>
                <a href="/disclaimer">Disclaimer</a>
                <a href="/dmca">DMCA</a>
                <a href="/report-abuse">Report Abuse</a>
              </div>
            </div>
            <div className="footer-bottom-right">
              <div className="security-badges">
                <div className="security-badge">
                  <Shield size={16} />
                  <span>SSL Secured</span>
                </div>
                <div className="security-badge">
                  <Shield size={16} />
                  <span>SOC 2 Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

