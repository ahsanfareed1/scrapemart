import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Zap, 
  Download, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Shield,
  Clock,
  Users,
  Target,
  Settings,
  Filter,
  BarChart3,
  Globe,
  Award,
  Play,
  ExternalLink
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import PageTransition from '../components/layout/PageTransition';
import './ShopifyScraper.css';

const ShopifyScraper = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Database size={32} />,
      title: "Complete Product Data",
      description: "Extract titles, descriptions, prices, variants, images, SKUs, and more from any Shopify store.",
      details: [
        "Product titles and handles",
        "Full product descriptions (HTML & plain text)",
        "Regular and compare-at prices",
        "All product images in high resolution",
        "Product variants (size, color, material)",
        "SKU and barcode information",
        "Inventory and stock status",
        "Product tags and categories",
        "Vendor information",
        "Product type classification",
        "Meta fields and custom attributes"
      ]
    },
    {
      icon: <Filter size={32} />,
      title: "Advanced Filtering",
      description: "Filter products by price range, collections, tags, vendors, and availability before scraping.",
      details: [
        "Price range filtering",
        "Collection-based filtering",
        "Tag-based filtering",
        "Vendor filtering",
        "Availability filtering",
        "Custom field filtering",
        "Date range filtering",
        "Product type filtering"
      ]
    },
    {
      icon: <Zap size={32} />,
      title: "Lightning Fast Processing",
      description: "Our optimized engine processes thousands of products in minutes with 100% accuracy.",
      details: [
        "Parallel processing",
        "Intelligent rate limiting",
        "Automatic retry on errors",
        "Real-time progress tracking",
        "Resume interrupted scraping",
        "Batch processing optimization"
      ]
    },
    {
      icon: <Download size={32} />,
      title: "Multiple Export Formats",
      description: "Export your data in CSV, JSON, or Excel format with custom field mapping.",
      details: [
        "Shopify CSV format",
        "Custom CSV templates",
        "JSON for developers",
        "Excel spreadsheets",
        "Custom field selection",
        "Data validation included"
      ]
    }
  ];

  const benefits = [
    {
      icon: <Clock size={24} />,
      title: "Save Time",
      description: "Extract thousands of products in minutes instead of hours of manual work"
    },
    {
      icon: <Shield size={24} />,
      title: "100% Accurate",
      description: "Get reliable data with our advanced extraction algorithms"
    },
    {
      icon: <Users size={24} />,
      title: "No Coding Required",
      description: "User-friendly interface that anyone can use"
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Analytics Ready",
      description: "Export data in formats ready for analysis and reporting"
    }
  ];

  const stats = [
    { number: "10M+", label: "Products Scraped" },
    { number: "50K+", label: "Shopify Stores" },
    { number: "99.9%", label: "Success Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <PageTransition>
      <div className="shopify-scraper-page">
        <Header />
        
        <PageBanner 
          title="Shopify Scraper"
          subtitle="Extract product data from any Shopify store with ease"
          icon={<Database size={32} />}
        />

        <div className="shopify-scraper-content">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="container">
              <div className="hero-content">
                <div className="hero-text">
                  <h1>Professional Shopify Data Extraction</h1>
                  <p>
                    Extract complete product catalogs from any Shopify store in minutes. 
                    Our advanced scraper handles complex product structures, variants, 
                    and custom fields with 100% accuracy.
                  </p>
                  
                  <div className="hero-features">
                    <div className="hero-feature">
                      <CheckCircle size={20} />
                      <span>No coding required</span>
                    </div>
                    <div className="hero-feature">
                      <CheckCircle size={20} />
                      <span>Export in seconds</span>
                    </div>
                    <div className="hero-feature">
                      <CheckCircle size={20} />
                      <span>100% accurate data</span>
                    </div>
                  </div>

                  <div className="hero-buttons">
                    <button onClick={() => navigate('/signup')} className="btn-primary large">
                      <Zap size={20} />
                      Start Scraping Now
                      <ArrowRight size={20} />
                    </button>
                    <button className="btn-secondary large">
                      <Play size={20} />
                      Watch Demo
                    </button>
                  </div>
                </div>
                
                <div className="hero-visual">
                  <div className="demo-card">
                    <div className="demo-header">
                      <div className="demo-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="demo-title">Shopify Scraper Dashboard</span>
                    </div>
                    <div className="demo-body">
                      <div className="demo-stats">
                        <div className="demo-stat">
                          <Database size={24} />
                          <div>
                            <h4>1,247</h4>
                            <p>Products Ready</p>
                          </div>
                        </div>
                        <div className="demo-stat">
                          <Zap size={24} />
                          <div>
                            <h4>98%</h4>
                            <p>Success Rate</p>
                          </div>
                        </div>
                      </div>
                      <div className="progress-demo">
                        <div className="progress-header">
                          <span>Scraping in progress...</span>
                          <span>87%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="stats-section">
            <div className="container">
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <h3>{stat.number}</h3>
                    <p>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="features-section">
            <div className="container">
              <div className="section-header">
                <h2>Powerful Shopify Scraping Features</h2>
                <p>Everything you need to extract complete product data from Shopify stores</p>
              </div>
              
              <div className="features-grid">
                {features.map((feature, index) => (
                  <div key={index} className="feature-card">
                    <div className="feature-icon">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    <ul className="feature-details">
                      {feature.details.map((detail, idx) => (
                        <li key={idx}>
                          <CheckCircle size={16} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="benefits-section">
            <div className="container">
              <div className="section-header">
                <h2>Why Choose Our Shopify Scraper?</h2>
                <p>Experience the benefits of professional-grade data extraction</p>
              </div>
              
              <div className="benefits-grid">
                {benefits.map((benefit, index) => (
                  <div key={index} className="benefit-card">
                    <div className="benefit-icon">{benefit.icon}</div>
                    <h4>{benefit.title}</h4>
                    <p>{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="pricing-preview-section">
            <div className="container">
              <div className="section-header">
                <h2>Simple, Transparent Pricing</h2>
                <p>Choose the plan that fits your needs</p>
              </div>
              
              <div className="pricing-cards">
                <div className="pricing-card">
                  <div className="pricing-header">
                    <h3>Free Forever</h3>
                    <div className="pricing-price">
                      <span className="price-amount">Free</span>
                      <span className="price-period">Forever</span>
                    </div>
                    <p className="pricing-description">Perfect for testing and small projects</p>
                  </div>
                  <ul className="pricing-features">
                    <li><CheckCircle size={16} /> 50 products per export</li>
                    <li><CheckCircle size={16} /> Shopify & WooCommerce support</li>
                    <li><CheckCircle size={16} /> CSV, Excel, and JSON export</li>
                    <li><CheckCircle size={16} /> Filter by title, tags, collection, categories, types, price range, vendors</li>
                    <li><CheckCircle size={16} /> Export Shopify to WooCommerce format</li>
                    <li><CheckCircle size={16} /> Export WooCommerce to Shopify format</li>
                    <li><CheckCircle size={16} /> Email support</li>
                  </ul>
                  <button onClick={() => navigate('/signup')} className="btn-secondary">
                    Get Started
                  </button>
                </div>
                
                <div className="pricing-card featured">
                  <div className="popular-badge">Most Popular</div>
                  <div className="pricing-header">
                    <h3>Pro Plan</h3>
                    <div className="pricing-price">
                      <span className="price-currency">$</span>
                      <span className="price-amount">19.99</span>
                      <span className="price-period">/month</span>
                    </div>
                    <p className="pricing-description">Unlimited products export for any website</p>
                  </div>
                  <ul className="pricing-features">
                    <li><CheckCircle size={16} /> Unlimited products</li>
                    <li><CheckCircle size={16} /> Shopify & WooCommerce support</li>
                    <li><CheckCircle size={16} /> All export formats (CSV, Excel, JSON)</li>
                    <li><CheckCircle size={16} /> Advanced filtering options</li>
                    <li><CheckCircle size={16} /> Export between formats</li>
                    <li><CheckCircle size={16} /> Priority support</li>
                    <li><CheckCircle size={16} /> 24/7 customer support</li>
                    <li><CheckCircle size={16} /> All features included</li>
                  </ul>
                  <button onClick={() => navigate('/signup')} className="btn-primary">
                    Get Started
                  </button>
                </div>
              </div>
              
              <div className="pricing-note">
                <Shield size={20} />
                <span>Both plans include: Export all products data, filters, format conversion, multiple export formats, and customer support</span>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <div className="container">
              <div className="cta-content">
                <h2>Ready to Start Scraping Shopify Stores?</h2>
                <p>Join thousands of users who are already extracting valuable product data</p>
                <div className="cta-buttons">
                  <button onClick={() => navigate('/signup')} className="btn-primary large">
                    Get Started
                    <ArrowRight size={20} />
                  </button>
                  <button onClick={() => navigate('/contact')} className="btn-secondary large">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default ShopifyScraper;
