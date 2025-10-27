import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Database, 
  Filter, 
  Download, 
  ArrowRight, 
  CheckCircle,
  Zap,
  Shield,
  Target,
  Clock,
  BarChart3,
  Users
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import PageTransition from '../components/layout/PageTransition';
import './HowItWorks.css';

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "01",
      icon: <Target size={32} />,
      title: "Enter Store URL",
      description: "Simply paste the Shopify or WooCommerce store URL you want to scrape data from.",
      details: [
        "Supports all Shopify stores",
        "Works with WooCommerce sites",
        "Automatic store detection",
        "URL validation included"
      ]
    },
    {
      number: "02",
      icon: <Filter size={32} />,
      title: "Configure Filters",
      description: "Set up filters to extract exactly the data you need - products, prices, categories, and more.",
      details: [
        "Price range filters",
        "Category selection",
        "Product availability",
        "Custom criteria"
      ]
    },
    {
      number: "03",
      icon: <Zap size={32} />,
      title: "Start Scraping",
      description: "Our powerful engine processes thousands of products in minutes with 100% accuracy.",
      details: [
        "Lightning fast processing",
        "Real-time progress tracking",
        "Automatic retry on errors",
        "Parallel data extraction"
      ]
    },
    {
      number: "04",
      icon: <Download size={32} />,
      title: "Export Data",
      description: "Download your scraped data in CSV, JSON, or Excel format with custom field mapping.",
      details: [
        "Multiple export formats",
        "Custom field selection",
        "Data validation included",
        "Instant download"
      ]
    }
  ];

  const benefits = [
    {
      icon: <Clock size={24} />,
      title: "Save Time",
      description: "Extract thousands of products in minutes instead of hours"
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

  return (
    <PageTransition>
      <div className="how-it-works-page">
        <Header />
        
        <PageBanner 
          title="How It Works"
          subtitle="Get started in minutes with our simple 4-step process"
          icon={<Play size={32} />}
        />

        <div className="how-it-works-content">
          {/* Steps Section */}
          <section className="steps-section">
            <div className="container">
              <div className="section-header">
                <h2>Simple 4-Step Process</h2>
                <p>From store URL to exported data in just a few clicks</p>
              </div>
              
              <div className="steps-container">
                {steps.map((step, index) => (
                  <div key={index} className="step-item">
                    <div className="step-number">{step.number}</div>
                    <div className="step-content">
                      <div className="step-icon">{step.icon}</div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                      <ul className="step-details">
                        {step.details.map((detail, idx) => (
                          <li key={idx}>
                            <CheckCircle size={16} />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="step-connector">
                        <ArrowRight size={24} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="benefits-section">
            <div className="container">
              <div className="section-header">
                <h2>Why Choose ScrapeMart?</h2>
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

          {/* Demo Section */}
          <section className="demo-section">
            <div className="container">
              <div className="demo-content">
                <div className="demo-text">
                  <h2>See It In Action</h2>
                  <p>
                    Watch our demo to see how easy it is to extract product data from any e-commerce store. 
                    From URL to exported data in under 5 minutes.
                  </p>
                  <div className="demo-features">
                    <div className="demo-feature">
                      <CheckCircle size={20} />
                      <span>Live demonstration</span>
                    </div>
                    <div className="demo-feature">
                      <CheckCircle size={20} />
                      <span>Real store examples</span>
                    </div>
                    <div className="demo-feature">
                      <CheckCircle size={20} />
                      <span>Export process shown</span>
                    </div>
                  </div>
                  <button className="btn-primary large">
                    <Play size={20} />
                    Watch Demo
                  </button>
                </div>
                <div className="demo-visual">
                  <div className="demo-card">
                    <div className="demo-header">
                      <div className="demo-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span className="demo-title">ScrapeMart Dashboard</span>
                    </div>
                    <div className="demo-body">
                      <div className="demo-progress">
                        <div className="progress-bar">
                          <div className="progress-fill"></div>
                        </div>
                        <span className="progress-text">Scraping products... 87% complete</span>
                      </div>
                      <div className="demo-stats">
                        <div className="demo-stat">
                          <Database size={20} />
                          <span>1,247 products found</span>
                        </div>
                        <div className="demo-stat">
                          <Zap size={20} />
                          <span>Processing speed: 150/min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="how-it-works-cta">
            <div className="container">
              <div className="cta-content">
                <h2>Ready to Get Started?</h2>
                <p>Join thousands of users who are already extracting valuable e-commerce data</p>
                <div className="cta-buttons">
                  <button onClick={() => navigate('/signup')} className="btn-primary large">
                    Start for free
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

export default HowItWorks;
