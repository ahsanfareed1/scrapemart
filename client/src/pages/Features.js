import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Zap, 
  Shield, 
  Download, 
  Filter, 
  BarChart3, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Lock,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import PageTransition from '../components/layout/PageTransition';
import './Features.css';

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Database size={32} />,
      title: "Advanced Data Extraction",
      description: "Extract product data, prices, descriptions, images, reviews, and more from any Shopify or WooCommerce store.",
      benefits: ["Product details", "Pricing data", "Customer reviews", "Inventory status"]
    },
    {
      icon: <Zap size={32} />,
      title: "Lightning Fast Speed",
      description: "Process thousands of products in minutes with our optimized scraping engine and parallel processing.",
      benefits: ["1000+ products/min", "Parallel processing", "Optimized algorithms", "Real-time updates"]
    },
    {
      icon: <Download size={32} />,
      title: "Multiple Export Formats",
      description: "Export your scraped data in CSV, JSON, XML, or Excel formats with custom field mapping.",
      benefits: ["CSV format", "JSON format", "Excel format", "Custom mapping"]
    },
    {
      icon: <Filter size={32} />,
      title: "Advanced Filtering",
      description: "Filter products by price range, category, availability, ratings, and custom criteria.",
      benefits: ["Price filters", "Category filters", "Rating filters", "Custom criteria"]
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Analytics & Insights",
      description: "Get detailed analytics on scraped data with charts, trends, and competitive analysis.",
      benefits: ["Data visualization", "Trend analysis", "Competitive insights", "Custom reports"]
    }
  ];

  const stats = [
    { icon: <Globe size={24} />, number: "10M+", label: "Products Scraped" },
    { icon: <Users size={24} />, number: "50K+", label: "Active Users" },
    { icon: <Clock size={24} />, number: "99.9%", label: "Uptime" },
    { icon: <Target size={24} />, number: "100%", label: "Accuracy" }
  ];

  return (
    <PageTransition>
      <div className="features-page">
        <Header />
        
        <PageBanner 
          title="Powerful Features"
          subtitle="Everything you need to extract and analyze e-commerce data"
          icon={<Star size={32} />}
        />

        <div className="features-content">
          {/* Stats Section */}
          <section className="features-stats-section">
            <div className="container">
              <div className="features-stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className="features-stat-card">
                    <div className="features-stat-icon">{stat.icon}</div>
                    <h3>{stat.number}</h3>
                    <p>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Main Features */}
          <section className="features-main-section">
            <div className="container">
              <div className="features-section-header">
                <h2>Core Features</h2>
                <p>Discover the powerful capabilities that make ScrapeMart the leading e-commerce data extraction tool</p>
              </div>
              
              <div className="features-main-grid">
                {features.map((feature, index) => (
                  <div key={index} className="features-feature-card">
                    <div className="features-feature-icon">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    <ul className="features-feature-benefits">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx}>
                          <CheckCircle size={16} />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Additional Features */}
          <section className="features-additional-section">
            <div className="container">
              <div className="features-section-header">
                <h2>Additional Capabilities</h2>
                <p>More features to enhance your data extraction workflow</p>
              </div>
              
              <div className="features-additional-grid">
                <div className="features-additional-card">
                  <Lock size={24} />
                  <h4>Proxy Support</h4>
                  <p>Use rotating proxies to avoid IP blocking and access geo-restricted content</p>
                </div>
                <div className="features-additional-card">
                  <TrendingUp size={24} />
                  <h4>Price Monitoring</h4>
                  <p>Track price changes over time and get alerts when prices drop</p>
                </div>
                <div className="features-additional-card">
                  <Clock size={24} />
                  <h4>Scheduled Scraping</h4>
                  <p>Set up automated scraping schedules to keep your data fresh</p>
                </div>
                <div className="features-additional-card">
                  <Target size={24} />
                  <h4>Custom Selectors</h4>
                  <p>Define custom CSS selectors to extract specific data elements</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="features-cta">
            <div className="container">
              <div className="cta-content">
                <h2>Ready to Get Started?</h2>
                <p>Experience the power of ScrapeMart with our free forever plan</p>
                <div className="cta-buttons">
                  <button onClick={() => navigate('/signup')} className="btn-primary large">
                    Start for free
                    <ArrowRight size={20} />
                  </button>
                  <button onClick={() => navigate('/contact')} className="btn-secondary large">
                    Contact Sales
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

export default Features;
