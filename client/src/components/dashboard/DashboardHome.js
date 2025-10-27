import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Package, 
  ShoppingCart, 
  CreditCard, 
  TrendingUp, 
  ArrowRight,
  Star,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import './DashboardHome.css';

const DashboardHome = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const scraperCards = [
    {
      title: 'Shopify Scraper',
      description: 'Extract products from Shopify stores',
      icon: Package,
      color: '#134575',
      gradient: 'linear-gradient(135deg, #134575 0%, #1e9b96 100%)',
      path: '/dashboard/scraper',
      features: ['Real-time extraction', 'CSV/Excel export', 'WooCommerce format']
    },
    {
      title: 'WooCommerce Scraper',
      description: 'Extract products from WooCommerce stores',
      icon: ShoppingCart,
      color: '#1e9b96',
      gradient: 'linear-gradient(135deg, #1e9b96 0%, #134575 100%)',
      path: '/dashboard/woocommerce-scraper',
      features: ['Store API integration', 'CSV/Excel export', 'Shopify format']
    }
  ];

  const quickActions = [
    {
      title: 'Billing & Plans',
      description: 'Manage your subscription',
      icon: CreditCard,
      path: '/dashboard/billing',
      color: '#16a34a'
    }
  ];

  const stats = [
    {
      label: 'Plan',
      value: profile?.subscription_tier === 'pro' ? 'Pro Plan' : 'Free Plan',
      icon: Star,
      color: profile?.subscription_tier === 'pro' ? '#f59e0b' : '#6b7280'
    },
    {
      label: 'Status',
      value: 'Active',
      icon: CheckCircle,
      color: '#16a34a'
    }
  ];

  return (
    <div className="dashboard-home">
      {/* Animated Background Banner */}
      <div className="welcome-banner">
        <div className="dashboard-banner-content">
          <div className="banner-text">
            <h1 className="welcome-title">
              <span className="greeting">{getGreeting()},</span>
              <span className="username">{user?.user_metadata?.full_name || 'User'}!</span>
            </h1>
            <p className="welcome-subtitle">
              Welcome back to ScrapeMart. Ready to extract some products?
            </p>
            <div className="welcome-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <stat.icon size={16} style={{ color: stat.color }} />
                  <span className="stat-label">{stat.label}:</span>
                  <span className="stat-value" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="banner-decoration">
          </div>
        </div>
      </div>

      {/* Scraper Cards */}
      <div className="scrapers-section">
        <div className="section-header">
          <h2>Product Scrapers</h2>
          <p>Choose your scraping tool to extract products from e-commerce stores</p>
        </div>
        
        <div className="scraper-cards">
          {scraperCards.map((scraper, index) => (
            <div 
              key={index} 
              className="scraper-card"
              onClick={() => navigate(scraper.path)}
            >
              <div className="card-header">
                <div className="card-icon" style={{ background: scraper.gradient }}>
                  <scraper.icon size={32} />
                </div>
                <div className="card-title">
                  <h3>{scraper.title}</h3>
                  <p>{scraper.description}</p>
                </div>
              </div>
              
              <div className="card-features">
                {scraper.features.map((feature, idx) => (
                  <div key={idx} className="feature-item">
                    <CheckCircle size={14} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="card-action">
                <span>Start Scraping</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <div className="section-header">
          <h2>Quick Actions</h2>
          <p>Manage your account and team settings</p>
        </div>
        
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <div 
              key={index} 
              className="quick-action-card"
              onClick={() => navigate(action.path)}
            >
              <div className="action-icon" style={{ backgroundColor: action.color }}>
                <action.icon size={24} />
              </div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <ArrowRight size={16} className="action-arrow" />
            </div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="tips-section">
        <div className="tip-card">
          <div className="tip-icon">
            <Sparkles size={24} />
          </div>
          <div className="tip-content">
            <h3>Pro Tip</h3>
            <p>
              Use filters to narrow down your product extraction. You can filter by vendor, 
              price range, product type, and more to get exactly what you need.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;