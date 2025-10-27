import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, DollarSign, Users, ShoppingCart, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import PageTransition from '../components/layout/PageTransition';
import './CaseStudies.css';

const CaseStudies = () => {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const caseStudies = [
    {
      id: 1,
      company: 'TrendyFashion Co.',
      industry: 'Fashion',
      challenge: 'Needed to migrate 5,000+ products from WooCommerce to Shopify while maintaining SEO rankings and product variants.',
      solution: 'Used ScrapeMart to extract all WooCommerce products with complete variant data, then imported directly into Shopify with optimized CSV format.',
      results: [
        { label: 'Products Migrated', value: '5,234', icon: ShoppingCart },
        { label: 'Time Saved', value: '120 hrs', icon: TrendingUp },
        { label: 'SEO Maintained', value: '100%', icon: CheckCircle },
        { label: 'Cost Saved', value: '$12,000', icon: DollarSign }
      ],
      testimonial: "ScrapeMart saved us months of manual work. The migration was seamless and our SEO rankings stayed intact. Incredible tool!",
      author: 'Sarah Johnson',
      position: 'E-commerce Director',
      timeframe: '2 weeks',
      image: '/case-study-fashion.jpg'
    },
    {
      id: 2,
      company: 'DropShip Masters',
      industry: 'Dropshipping',
      challenge: 'Finding winning products by analyzing top-performing dropshipping stores and identifying trending items before saturation.',
      solution: 'Regularly scraped successful dropshipping stores to analyze product trends, pricing strategies, and supplier information.',
      results: [
        { label: 'Stores Analyzed', value: '50+', icon: ShoppingCart },
        { label: 'Products Found', value: '1,200', icon: TrendingUp },
        { label: 'Revenue Increase', value: '+340%', icon: DollarSign },
        { label: 'Time to Market', value: '5x Faster', icon: CheckCircle }
      ],
      testimonial: "We found 3 winning products in the first month using ScrapeMart. Our revenue tripled and we're now scaling rapidly.",
      author: 'Mike Chen',
      position: 'Founder',
      timeframe: '3 months',
      image: '/case-study-dropshipping.jpg'
    },
    {
      id: 3,
      company: 'HomeDecor Plus',
      industry: 'Home & Garden',
      challenge: 'Monitoring competitor prices across 20+ stores to maintain competitive pricing while protecting margins.',
      solution: 'Set up weekly scraping of competitor stores to track price changes and adjust pricing strategy accordingly.',
      results: [
        { label: 'Competitors Tracked', value: '23', icon: Users },
        { label: 'Products Monitored', value: '3,500', icon: ShoppingCart },
        { label: 'Margin Improved', value: '+15%', icon: TrendingUp },
        { label: 'Sales Increase', value: '+28%', icon: DollarSign }
      ],
      testimonial: "Competitive intelligence made easy. We now make data-driven pricing decisions instead of guessing.",
      author: 'Jennifer Lee',
      position: 'Pricing Manager',
      timeframe: 'Ongoing',
      image: '/case-study-homedecor.jpg'
    },
    {
      id: 4,
      company: 'TechGear Hub',
      industry: 'Electronics',
      challenge: 'Creating comprehensive product catalog from scratch for a new electronics marketplace launch.',
      solution: 'Scraped multiple supplier websites and tech stores to build initial product catalog with complete specifications.',
      results: [
        { label: 'Products Added', value: '8,400', icon: ShoppingCart },
        { label: 'Launch Timeline', value: '3 weeks', icon: CheckCircle },
        { label: 'First Month Sales', value: '$145K', icon: DollarSign },
        { label: 'Customer Reviews', value: '4.8/5', icon: TrendingUp }
      ],
      testimonial: "We launched a full-featured marketplace in 3 weeks. Without ScrapeMart, it would have taken 6+ months.",
      author: 'David Rodriguez',
      position: 'CTO',
      timeframe: '3 weeks',
      image: '/case-study-tech.jpg'
    },
    {
      id: 5,
      company: 'BeautyBox Store',
      industry: 'Beauty & Cosmetics',
      challenge: 'Needed to regularly update product descriptions and images to match manufacturer updates across 2,000+ products.',
      solution: 'Monthly scraping of manufacturer websites to keep product information current and accurate.',
      results: [
        { label: 'Products Updated', value: '2,100', icon: ShoppingCart },
        { label: 'Update Frequency', value: 'Monthly', icon: CheckCircle },
        { label: 'Return Rate', value: '-40%', icon: TrendingUp },
        { label: 'Customer Satisfaction', value: '+35%', icon: Users }
      ],
      testimonial: "Keeping our product information accurate used to be a nightmare. Now it's automated and our customers trust us more.",
      author: 'Emma Williams',
      position: 'Operations Manager',
      timeframe: '6 months',
      image: '/case-study-beauty.jpg'
    },
    {
      id: 6,
      company: 'SportsPro Retail',
      industry: 'Sports & Fitness',
      challenge: 'Expanding product range by sourcing products from multiple suppliers and creating unified catalog.',
      solution: 'Scraped multiple supplier catalogs and merged data into a single, comprehensive product database.',
      results: [
        { label: 'Suppliers Integrated', value: '15', icon: Users },
        { label: 'SKUs Added', value: '6,800', icon: ShoppingCart },
        { label: 'Revenue Growth', value: '+180%', icon: DollarSign },
        { label: 'Market Share', value: '+12%', icon: TrendingUp }
      ],
      testimonial: "ScrapeMart helped us become the one-stop shop for sports equipment in our region. Game changer!",
      author: 'Chris Anderson',
      position: 'CEO',
      timeframe: '4 months',
      image: '/case-study-sports.jpg'
    }
  ];

  const industries = ['all', 'Fashion', 'Dropshipping', 'Home & Garden', 'Electronics', 'Beauty & Cosmetics', 'Sports & Fitness'];

  const filteredCaseStudies = selectedIndustry === 'all'
    ? caseStudies
    : caseStudies.filter(cs => cs.industry === selectedIndustry);

  return (
    <PageTransition>
      <div className="case-studies-page">
        <Header />
        
        <PageBanner 
          title="Success Stories"
          subtitle="See how businesses like yours achieve success with ScrapeMart"
          icon={<TrendingUp size={32} />}
        />

        <div className="case-studies-content">
          <div className="container">
            {/* Stats Overview */}
            <div className="stats-overview">
              <div className="stat-card">
                <ShoppingCart size={32} />
                <div className="stat-info">
                  <h3>50M+</h3>
                  <p>Products Scraped</p>
                </div>
              </div>
              <div className="stat-card">
                <Users size={32} />
                <div className="stat-info">
                  <h3>10,000+</h3>
                  <p>Happy Customers</p>
                </div>
              </div>
              <div className="stat-card">
                <TrendingUp size={32} />
                <div className="stat-info">
                  <h3>4.9/5</h3>
                  <p>Customer Rating</p>
                </div>
              </div>
              <div className="stat-card">
                <DollarSign size={32} />
                <div className="stat-info">
                  <h3>$10M+</h3>
                  <p>Revenue Generated</p>
                </div>
              </div>
            </div>

            {/* Industry Filter */}
            <div className="industry-filter">
              <h3>Filter by Industry:</h3>
              <div className="industry-buttons">
                {industries.map(industry => (
                  <button
                    key={industry}
                    className={`industry-btn ${selectedIndustry === industry ? 'active' : ''}`}
                    onClick={() => setSelectedIndustry(industry)}
                  >
                    {industry === 'all' ? 'All Industries' : industry}
                  </button>
                ))}
              </div>
            </div>

            {/* Case Studies */}
            <div className="case-studies-list">
              {filteredCaseStudies.map((caseStudy, index) => (
                <div key={caseStudy.id} className={`case-study-card ${index % 2 === 1 ? 'reverse' : ''}`}>
                  <div className="case-study-image">
                    <div className="industry-badge">{caseStudy.industry}</div>
                  </div>

                  <div className="case-study-content">
                    <h2>{caseStudy.company}</h2>
                    
                    <div className="case-section">
                      <h3>The Challenge</h3>
                      <p>{caseStudy.challenge}</p>
                    </div>

                    <div className="case-section">
                      <h3>The Solution</h3>
                      <p>{caseStudy.solution}</p>
                    </div>

                    <div className="case-section">
                      <h3>Results ({caseStudy.timeframe})</h3>
                      <div className="results-grid">
                        {caseStudy.results.map((result, idx) => (
                          <div key={idx} className="result-item">
                            <result.icon size={24} />
                            <div>
                              <h4>{result.value}</h4>
                              <p>{result.label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="testimonial-box">
                      <p className="testimonial-text">"{caseStudy.testimonial}"</p>
                      <div className="testimonial-author">
                        <strong>{caseStudy.author}</strong>
                        <span>{caseStudy.position}, {caseStudy.company}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="cta-section">
              <h2>Ready to Write Your Success Story?</h2>
              <p>Join thousands of successful businesses using ScrapeMart to grow their e-commerce operations.</p>
              <div className="cta-buttons">
                <button onClick={() => navigate('/signup')} className="btn-primary large">
                  Start for free
                  <ArrowRight size={20} />
                </button>
                <button onClick={() => navigate('/contact')} className="btn-secondary large">
                  Talk to Sales
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default CaseStudies;

