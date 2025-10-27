import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import PageTransition from '../components/layout/PageTransition';
import './Tutorials.css';

const Tutorials = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState('all');

  const tutorials = [
    {
      id: 1,
      title: 'Shopify Product Scraping for Beginners',
      description: 'Learn the basics of scraping Shopify stores. Perfect for first-time users.',
      duration: '10 min',
      level: 'Beginner',
      category: 'Shopify',
      steps: [
        'Creating your ScrapeMart account',
        'Understanding the Shopify scraper interface',
        'Entering your first store URL',
        'Using basic filters',
        'Exporting your first product list',
        'Importing to your own store'
      ],
      videoUrl: '#',
      completed: false
    },
    {
      id: 2,
      title: 'Advanced Filtering Techniques',
      description: 'Master advanced filtering to target exact products you need.',
      duration: '15 min',
      level: 'Intermediate',
      category: 'Features',
      steps: [
        'Understanding filter combinations',
        'Using collection filters effectively',
        'Price range filtering strategies',
        'Vendor and tag filtering',
        'Saving filter presets',
        'Real-world filtering examples'
      ],
      videoUrl: '#',
      completed: false
    },
    {
      id: 3,
      title: 'WooCommerce to Shopify Migration',
      description: 'Complete guide to migrating your WooCommerce store to Shopify.',
      duration: '25 min',
      level: 'Intermediate',
      category: 'WooCommerce',
      steps: [
        'Backing up your WooCommerce store',
        'Scraping WooCommerce products',
        'Preparing data for Shopify',
        'Setting up your new Shopify store',
        'Importing products and variants',
        'Setting up redirects',
        'Testing your new store',
        'Going live'
      ],
      videoUrl: '#',
      completed: false
    },
    {
      id: 4,
      title: 'Competitive Price Monitoring',
      description: 'Set up automated competitor price tracking and analysis.',
      duration: '20 min',
      level: 'Advanced',
      category: 'Market Research',
      steps: [
        'Identifying competitor stores',
        'Setting up regular scraping',
        'Exporting competitor data',
        'Creating price comparison sheets',
        'Analyzing pricing trends',
        'Adjusting your pricing strategy'
      ],
      videoUrl: '#',
      completed: false
    },
    {
      id: 5,
      title: 'Dropshipping Product Research',
      description: 'Find winning products by analyzing successful dropshipping stores.',
      duration: '30 min',
      level: 'Intermediate',
      category: 'Dropshipping',
      steps: [
        'Finding successful dropshipping stores',
        'Identifying trending products',
        'Scraping product data',
        'Analyzing product performance',
        'Finding suppliers',
        'Calculating profit margins',
        'Making product selection decisions'
      ],
      videoUrl: '#',
      completed: false
    },
    {
      id: 6,
      title: 'Bulk Product Updates',
      description: 'Learn how to scrape, modify, and re-import product data efficiently.',
      duration: '18 min',
      level: 'Advanced',
      category: 'Shopify',
      steps: [
        'Exporting your current products',
        'Opening CSV in Excel or Google Sheets',
        'Bulk editing techniques',
        'Updating prices and descriptions',
        'Re-importing updated products',
        'Verifying changes'
      ],
      videoUrl: '#',
      completed: false
    },
    {
      id: 7,
      title: 'Creating Product Feeds',
      description: 'Generate product feeds for advertising and marketplace listings.',
      duration: '22 min',
      level: 'Advanced',
      category: 'Marketing',
      steps: [
        'Understanding product feed requirements',
        'Scraping with specific fields',
        'Formatting data for different platforms',
        'Creating Google Shopping feeds',
        'Facebook catalog feeds',
        'Amazon listing feeds',
        'Automating feed updates'
      ],
      videoUrl: '#',
      completed: false
    },
    {
      id: 8,
      title: 'SEO Optimization with Scraped Data',
      description: 'Use competitor data to improve your product SEO.',
      duration: '16 min',
      level: 'Intermediate',
      category: 'SEO',
      steps: [
        'Scraping competitor product titles',
        'Analyzing keyword usage',
        'Studying product descriptions',
        'Identifying SEO patterns',
        'Optimizing your own products',
        'Measuring improvement'
      ],
      videoUrl: '#',
      completed: false
    }
  ];

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredTutorials = selectedLevel === 'all' 
    ? tutorials 
    : tutorials.filter(t => t.level === selectedLevel);

  const getLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <PageTransition>
      <div className="tutorials-page">
        <Header />
        
        <PageBanner 
          title="Video Tutorials"
          subtitle="Step-by-step guides to master ScrapeMart"
          icon={<PlayCircle size={32} />}
        />

        <div className="tutorials-content">
          <div className="container">
            {/* Filter Bar */}
            <div className="tutorial-filters">
              <h3>Filter by Level:</h3>
              <div className="level-buttons">
                {levels.map(level => (
                  <button
                    key={level}
                    className={`level-btn ${selectedLevel === level ? 'active' : ''}`}
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level === 'all' ? 'All Tutorials' : level}
                  </button>
                ))}
              </div>
            </div>

            {/* Tutorials Grid */}
            <div className="tutorials-grid">
              {filteredTutorials.map(tutorial => (
                <div key={tutorial.id} className="tutorial-card">
                  <div className="tutorial-header">
                    <div className="tutorial-thumbnail">
                      <PlayCircle size={48} />
                      <div className="play-overlay">
                        <span>Play Tutorial</span>
                      </div>
                    </div>
                    <div className="tutorial-badges">
                      <span 
                        className="level-badge" 
                        style={{ background: getLevelColor(tutorial.level) }}
                      >
                        {tutorial.level}
                      </span>
                      <span className="category-badge">{tutorial.category}</span>
                    </div>
                  </div>

                  <div className="tutorial-body">
                    <h3>{tutorial.title}</h3>
                    <p>{tutorial.description}</p>

                    <div className="tutorial-meta">
                      <span className="duration">
                        <Clock size={16} />
                        {tutorial.duration}
                      </span>
                      <span className="steps-count">
                        {tutorial.steps.length} steps
                      </span>
                    </div>

                    <div className="tutorial-steps">
                      <h4>What you'll learn:</h4>
                      <ul>
                        {tutorial.steps.slice(0, 4).map((step, index) => (
                          <li key={index}>
                            <ChevronRight size={16} />
                            {step}
                          </li>
                        ))}
                        {tutorial.steps.length > 4 && (
                          <li className="more-steps">
                            + {tutorial.steps.length - 4} more steps
                          </li>
                        )}
                      </ul>
                    </div>

                    <button className="start-tutorial-btn">
                      <PlayCircle size={20} />
                      Start Tutorial
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coming Soon Section */}
            <div className="coming-soon-section">
              <TrendingUp size={48} />
              <h2>More Tutorials Coming Soon</h2>
              <p>We're constantly creating new tutorials to help you master e-commerce data extraction. Subscribe to our newsletter to get notified when new tutorials are released.</p>
              <button onClick={() => navigate('/contact')} className="btn-primary">
                Stay Updated
              </button>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Tutorials;

