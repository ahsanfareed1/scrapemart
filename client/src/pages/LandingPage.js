import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Zap, 
  Database, 
  Download, 
  Filter, 
  Users, 
  ArrowRight,
  Play,
  Shield,
  Clock,
  Globe,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  Star,
  Award,
  TrendingUp,
  BarChart3,
  Settings,
  Lock,
  Eye,
  Target,
  Rocket,
  Cpu,
  Layers,
  FileText,
  AlertCircle
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageTransition from '../components/layout/PageTransition';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How does ScrapeMart work?",
      answer: "ScrapeMart uses advanced web scraping technology to extract product data from Shopify and WooCommerce stores. Simply enter the store URL, configure your filters, and our system will automatically scrape and organize the data for you."
    },
    {
      question: "Is scraping legal?",
      answer: "Yes, scraping publicly available data is legal. We only scrape data that is publicly accessible on store websites. We respect robots.txt files and implement rate limiting to ensure we don't overload servers."
    },
    {
      question: "What data can I extract?",
      answer: "You can extract product names, descriptions, prices, images, variants, collections, tags, vendor information, SKUs, and more. The exact data depends on what's publicly available on the store."
    },
    {
      question: "How fast is the scraping process?",
      answer: "Scraping speed depends on the store size and server response time. Typically, we can scrape 100-500 products per minute, but this varies by store. Large stores with thousands of products may take 10-30 minutes."
    },
    {
      question: "Can I scrape password-protected stores?",
      answer: "No, ScrapeMart only scrapes publicly accessible data. We cannot access password-protected areas or private stores. All scraping is done on publicly available product pages."
    },
    {
      question: "What file formats do you support?",
      answer: "We support CSV and JSON export formats. CSV files are perfect for importing into other stores, while JSON provides structured data for developers and APIs."
    },
    {
      question: "Do you offer API access?",
      answer: "Yes, Pro plan subscribers get access to our REST API, allowing you to integrate ScrapeMart into your own applications and automate scraping workflows."
    },
    {
      question: "What if scraping fails?",
      answer: "If scraping fails, our system will automatically retry up to 3 times. If it continues to fail, you'll be notified and can contact our support team for assistance."
    }
  ];

  const steps = [
    {
      icon: <Target size={32} />,
      title: "Enter Store URL",
      description: "Simply paste the Shopify or WooCommerce store URL you want to scrape"
    },
    {
      icon: <Settings size={32} />,
      title: "Configure Filters",
      description: "Set up filters for price range, categories, vendors, or any other criteria"
    },
    {
      icon: <Rocket size={32} />,
      title: "Start Scraping",
      description: "Click start and watch as our system extracts all the product data"
    },
    {
      icon: <Download size={32} />,
      title: "Export Data",
      description: "Download your data in CSV or JSON format, ready for import"
    }
  ];

  const features = [
    {
      icon: <Zap size={32} />,
      title: "Lightning Fast",
      description: "Scrape entire Shopify stores in seconds with our optimized scraping engine.",
      details: "Our advanced algorithms and distributed infrastructure ensure maximum speed while respecting server resources."
    },
    {
      icon: <Download size={32} />,
      title: "Easy Export",
      description: "Export to CSV in Shopify format, ready for import into your store.",
      details: "Multiple export formats including CSV, JSON, and Excel."
    },
    {
      icon: <Filter size={32} />,
      title: "Advanced Filters",
      description: "Filter by vendor, tags, collections, price range before exporting.",
      details: "Powerful filtering options including price ranges, categories, tags, vendors, and custom criteria."
    },
    {
      icon: <CheckCircle size={32} />,
      title: "Live Preview",
      description: "See products as they're being scraped with real-time progress updates.",
      details: "Real-time preview of scraped data with progress indicators and error handling."
    },
    {
      icon: <Users size={32} />,
      title: "Team Collaboration",
      description: "Invite team members and collaborate on scraping projects together.",
      details: "Share projects with team members, assign roles, and collaborate on large scraping tasks."
    },
    {
      icon: <Globe size={32} />,
      title: "Global Support",
      description: "Support for stores worldwide with multi-language capabilities.",
      details: "Scrape stores from any country with support for multiple currencies and languages."
    }
  ];

  return (
    <div className="landing-page">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <Star size={16} />
                <span>Trusted by 10,000+ merchants</span>
              </div>
              
              <h1 className="hero-title">
                Extract E-commerce Data in 
                <span className="gradient-text"> Lightning Speed</span>
              </h1>
              
              <p className="hero-subtitle">
                The most powerful Shopify & WooCommerce scraping tool. Export thousands of products 
                in minutes with advanced filtering, automatic formatting, and zero coding required.
              </p>
              
              <div className="hero-features-list">
                <div className="hero-feature-item">
                  <CheckCircle size={20} />
                  <span>No coding required</span>
                </div>
                <div className="hero-feature-item">
                  <CheckCircle size={20} />
                  <span>Export in seconds</span>
                </div>
                <div className="hero-feature-item">
                  <CheckCircle size={20} />
                  <span>100% accurate data</span>
                </div>
              </div>
              
              <div className="hero-buttons">
                <button onClick={() => navigate('/signup')} className="btn-primary large hero-cta">
                  <Rocket size={20} />
                  Start for free
                  <ArrowRight size={20} />
                </button>
                <button onClick={() => navigate('/signin')} className="btn-secondary large">
                  <Play size={20} />
                  Watch Demo
                </button>
              </div>
              
              <div className="hero-stats">
                <div className="stat-item">
                  <h3>10M+</h3>
                  <p>Products Scraped</p>
                </div>
                <div className="stat-item">
                  <h3>50K+</h3>
                  <p>Active Users</p>
                </div>
                <div className="stat-item">
                  <h3>99.9%</h3>
                  <p>Uptime</p>
                </div>
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="hero-card">
                <div className="card-header">
                  <div className="card-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="card-title">ScrapeMart Dashboard</span>
                </div>
                <div className="card-content">
                  <div className="demo-stats">
                    <div className="demo-stat">
                      <Database size={24} />
                      <div>
                        <h4>1,247</h4>
                        <p>Products Ready</p>
                      </div>
                    </div>
                    <div className="demo-stat">
                      <TrendingUp size={24} />
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
                  <div className="demo-actions">
                    <button className="demo-btn">
                      <Download size={16} />
                      Export CSV
                    </button>
                    <button className="demo-btn secondary">
                      <Eye size={16} />
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How ScrapeMart Works</h2>
          <p className="section-subtitle">Get started in minutes with our simple 4-step process</p>
          
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{index + 1}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>

          <div className="demo-section">
            <div className="demo-content">
              <h3>See ScrapeMart in Action</h3>
              <p>Watch our 2-minute demo to see how easy it is to scrape product data from any Shopify or WooCommerce store.</p>
              <button className="btn-primary large">
                <Play size={20} />
                Watch Demo
              </button>
            </div>
            <div className="demo-video">
              <div className="video-placeholder">
                <Play size={48} />
                <p>Demo Video Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features-section">
        <div className="container">
          <h2 className="section-title">Why Choose ScrapeMart?</h2>
          <p className="section-subtitle">Powerful features designed for e-commerce professionals</p>
          
          {/* Feature Grid Layout */}
          <div className="features-grid-layout">
            {/* Left Side - Feature Details */}
            <div className="feature-details-panel">
              <div className="feature-detail-icon">
                {features[activeFeatureTab].icon}
              </div>
              <h3>{features[activeFeatureTab].title}</h3>
              <p className="feature-detail-description">{features[activeFeatureTab].description}</p>
              <div className="feature-detail-items">
                {features[activeFeatureTab].details.split('. ').filter(item => item.trim()).map((item, idx) => (
                  <div key={idx} className="detail-item">
                    <CheckCircle size={20} />
                    <span>{item.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Side - Feature Cards Grid */}
            <div className="feature-cards-grid">
              {features.map((feature, index) => (
                <button
                  key={index}
                  className={`feature-card ${activeFeatureTab === index ? 'active' : ''}`}
                  onClick={() => setActiveFeatureTab(index)}
                >
                  <div className="feature-card-icon">{feature.icon}</div>
                  <span className="feature-card-title">{feature.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="landing-pricing-section">
        <div className="container">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <div className="landing-pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Free Forever</h3>
                <div className="price">
                  <span className="amount">Free</span>
                  <span className="period"> Forever</span>
                </div>
                <p className="pricing-description">Perfect for testing and small projects</p>
              </div>
              <ul className="pricing-features">
                <li><CheckCircle size={18} /> 50 products per export</li>
                <li><CheckCircle size={18} /> Shopify & WooCommerce support</li>
                <li><CheckCircle size={18} /> CSV, Excel, and JSON export</li>
                <li><CheckCircle size={18} /> Filter by title, tags, collection, price, vendors</li>
                <li><CheckCircle size={18} /> Export Shopify to WooCommerce format</li>
                <li><CheckCircle size={18} /> Export WooCommerce to Shopify format</li>
                <li><CheckCircle size={18} /> Email support</li>
                <li><CheckCircle size={18} /> Basic filters</li>
              </ul>
              <button onClick={() => navigate('/signup')} className="btn-secondary wide">
                Get Started
              </button>
            </div>
            <div className="pricing-card featured">
              <div className="featured-badge">Most Popular</div>
              <div className="pricing-header">
                <h3>Pro Plan</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">19.99</span>
                  <span className="period">/month</span>
                </div>
                <p className="pricing-description">Unlimited products export for any website</p>
              </div>
              <ul className="pricing-features">
                <li><CheckCircle size={18} /> Unlimited products</li>
                <li><CheckCircle size={18} /> Shopify & WooCommerce support</li>
                <li><CheckCircle size={18} /> All export formats (CSV, Excel, JSON)</li>
                <li><CheckCircle size={18} /> Advanced filtering options</li>
                <li><CheckCircle size={18} /> Export between formats</li>
                <li><CheckCircle size={18} /> Priority support</li>
                <li><CheckCircle size={18} /> 24/7 customer support</li>
                <li><CheckCircle size={18} /> All features included</li>
              </ul>
              <button onClick={() => navigate('/signup')} className="btn-primary wide">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Shopify Scraper Section */}
      <section id="shopify-scraper" className="platform-section shopify-section">
        <div className="container">
          <div className="platform-content">
            <div className="platform-text">
              <h2 className="section-title">Shopify Scraper</h2>
              <p className="section-subtitle">Extract product data from any Shopify store with ease</p>
              
              <div className="platform-features">
                <div className="platform-feature">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Complete Product Data</h4>
                    <p>Extract titles, descriptions, prices, variants, images, SKUs, and more from any Shopify store.</p>
                  </div>
                </div>
                <div className="platform-feature">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Collection & Tag Support</h4>
                    <p>Scrape entire collections or filter by specific tags to get exactly the products you need.</p>
                  </div>
                </div>
                <div className="platform-feature">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Variant Extraction</h4>
                    <p>Automatically extract all product variants including sizes, colors, and custom options.</p>
                  </div>
                </div>
                <div className="platform-feature">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Bulk Image Download</h4>
                    <p>Download all product images in high resolution with organized file naming.</p>
                  </div>
                </div>
              </div>

              <div className="platform-stats">
                <div className="stat">
                  <h3>10M+</h3>
                  <p>Products Scraped</p>
                </div>
                <div className="stat">
                  <h3>50K+</h3>
                  <p>Shopify Stores</p>
                </div>
                <div className="stat">
                  <h3>99.9%</h3>
                  <p>Success Rate</p>
                </div>
              </div>

              <button onClick={() => navigate('/signup')} className="btn-primary large">
                Start Scraping Shopify Stores
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="platform-visual">
              <div className="platform-card">
                <h4>Supported Data Fields</h4>
                <ul className="data-fields">
                  <li><CheckCircle size={16} /> Product Title & Handle</li>
                  <li><CheckCircle size={16} /> Description (HTML & Plain Text)</li>
                  <li><CheckCircle size={16} /> Price & Compare at Price</li>
                  <li><CheckCircle size={16} /> Product Images (All)</li>
                  <li><CheckCircle size={16} /> Variants (Size, Color, etc.)</li>
                  <li><CheckCircle size={16} /> SKU & Barcode</li>
                  <li><CheckCircle size={16} /> Inventory & Stock Status</li>
                  <li><CheckCircle size={16} /> Product Tags</li>
                  <li><CheckCircle size={16} /> Collections</li>
                  <li><CheckCircle size={16} /> Vendor Information</li>
                  <li><CheckCircle size={16} /> Product Type</li>
                  <li><CheckCircle size={16} /> Meta Fields</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WooCommerce Scraper Section */}
      <section id="woocommerce-scraper" className="platform-section woocommerce-section">
        <div className="container">
          <div className="platform-content reverse">
            <div className="platform-visual">
              <div className="platform-card">
                <h4>WooCommerce Features</h4>
                <ul className="data-fields">
                  <li><CheckCircle size={16} /> Product Name & Slug</li>
                  <li><CheckCircle size={16} /> Long & Short Descriptions</li>
                  <li><CheckCircle size={16} /> Regular & Sale Price</li>
                  <li><CheckCircle size={16} /> Product Gallery Images</li>
                  <li><CheckCircle size={16} /> Variable Products</li>
                  <li><CheckCircle size={16} /> Attributes & Variations</li>
                  <li><CheckCircle size={16} /> Stock Quantity</li>
                  <li><CheckCircle size={16} /> Product Categories</li>
                  <li><CheckCircle size={16} /> Product Tags</li>
                  <li><CheckCircle size={16} /> Weight & Dimensions</li>
                  <li><CheckCircle size={16} /> Shipping Class</li>
                  <li><CheckCircle size={16} /> Reviews & Ratings</li>
                </ul>
              </div>
            </div>
            <div className="platform-text">
              <h2 className="section-title">WooCommerce Scraper</h2>
              <p className="section-subtitle">Powerful scraping tool for WooCommerce stores</p>
              
              <div className="platform-features">
                <div className="platform-feature">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Full Product Extraction</h4>
                    <p>Extract all product data from WooCommerce stores including custom fields and attributes.</p>
                  </div>
                </div>
                <div className="platform-feature">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Category Scraping</h4>
                    <p>Scrape specific categories or the entire store catalog with filtering options.</p>
                  </div>
                </div>
                <div className="platform-feature">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Review Extraction</h4>
                    <p>Optionally extract customer reviews and ratings for competitive analysis.</p>
                  </div>
                </div>
                <div className="platform-feature">
                  <CheckCircle size={24} />
                  <div>
                    <h4>WooCommerce CSV Format</h4>
                    <p>Export in native WooCommerce CSV format for seamless store migration.</p>
                  </div>
                </div>
              </div>

              <div className="platform-stats">
                <div className="stat">
                  <h3>5M+</h3>
                  <p>Products Extracted</p>
                </div>
                <div className="stat">
                  <h3>25K+</h3>
                  <p>WooCommerce Sites</p>
                </div>
                <div className="stat">
                  <h3>Fast</h3>
                  <p>Processing Speed</p>
                </div>
              </div>

              <button onClick={() => navigate('/signup')} className="btn-primary large">
                Start Scraping WooCommerce
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

    
      {/* Help Section */}
      <section id="help" className="landing-help-section">
        <div className="container">
          <h2 className="section-title">Help & Support</h2>
          <p className="section-subtitle">We're here to help you succeed</p>
          
          <div className="landing-help-grid">
            <div className="help-card">
              <div className="help-icon">
                <MessageCircle size={32} />
              </div>
              <h3>Live Chat Support</h3>
              <p>Get instant help from our support team. Available 24/7 for all your questions.</p>
              <button className="btn-link">Start Chat <ArrowRight size={16} /></button>
            </div>
            
            <div className="help-card">
              <div className="help-icon">
                <Mail size={32} />
              </div>
              <h3>Email Support</h3>
              <p>Send us an email and we'll respond within 24 hours with detailed solutions.</p>
              <button className="btn-link">Email Us <ArrowRight size={16} /></button>
            </div>
            
            <div className="help-card">
              <div className="help-icon">
                <FileText size={32} />
              </div>
              <h3>Documentation</h3>
              <p>Comprehensive guides and tutorials to help you get the most out of ScrapeMart.</p>
              <button className="btn-link">View Docs <ArrowRight size={16} /></button>
            </div>
            
          
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join hundreds of merchants using ScrapeMart to export Shopify products</p>
            <button onClick={() => navigate('/signup')} className="btn-primary large">
              Start for free <ArrowRight size={20} />
            </button>
            
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;



