import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  X, 
  ArrowRight, 
  Star, 
  Zap, 
  Crown,
  Users,
  Database,
  Clock,
  Shield
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import PageTransition from '../components/layout/PageTransition';
import './Pricing.css';

const Pricing = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: "Free Forever",
      description: "Perfect for testing and small projects",
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: <Users size={32} />,
      popular: false,
      features: [
        "50 products per export",
        "Shopify & WooCommerce support",
        "CSV, Excel, and JSON export",
        "Filter by title, tags, collection, price, vendors",
        "Export Shopify to WooCommerce format",
        "Export WooCommerce to Shopify format",
        "Email support",
        "Basic filters"
      ],
      limitations: []
    },
    {
      name: "Pro Plan",
      description: "Unlimited products export for any website",
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      icon: <Zap size={32} />,
      popular: true,
      features: [
        "Unlimited products",
        "Shopify & WooCommerce support",
        "All export formats (CSV, Excel, JSON)",
        "Advanced filtering options",
        "Export between formats",
        "Priority support",
        "24/7 customer support",
        "All features included"
      ],
      limitations: []
    }
  ];

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
    },
    {
      question: "What happens if I exceed my limits?",
      answer: "We'll notify you when you're approaching your limits. You can upgrade your plan or purchase additional credits."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 14-day free trial. If you're not satisfied, you can cancel within the trial period for a full refund."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees for any plan. You only pay the monthly or yearly subscription fee."
    }
  ];

  return (
    <PageTransition>
      <div className="pricing-page">
        <Header />
        
        <PageBanner 
          title="Simple, Transparent Pricing"
          subtitle="Choose the plan that fits your needs. Start with a 14-day free trial."
          icon={<Star size={32} />}
        />

        <div className="pricing-content">
          {/* Billing Toggle */}
          <section className="billing-toggle-section">
            <div className="container">
              <div className="billing-toggle">
                <span className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
                <button 
                  className={`toggle-switch ${billingCycle === 'yearly' ? 'yearly' : ''}`}
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                >
                  <div className="toggle-slider"></div>
                </button>
                <span className={billingCycle === 'yearly' ? 'active' : ''}>
                  Yearly 
                  <span className="discount-badge">Save 20%</span>
                </span>
              </div>
            </div>
          </section>

          {/* Pricing Plans */}
          <section className="pricing-plans-section">
            <div className="container">
              <div className="pricing-plans-grid">
                {plans.map((plan, index) => (
                  <div key={index} className={`pricing-plan-card ${plan.popular ? 'popular' : ''}`}>
                    {plan.popular && (
                      <div className="pricing-popular-badge">
                        <Star size={16} />
                        Most Popular
                      </div>
                    )}
                    
                    <div className="pricing-plan-header">
                      <div className="pricing-plan-icon">{plan.icon}</div>
                      <h3>{plan.name}</h3>
                      <p>{plan.description}</p>
                      <div className="pricing-plan-price">
                        {plan.monthlyPrice === 0 ? (
                          <>
                            <span className="pricing-amount">Free</span>
                            <span className="pricing-period"> Forever</span>
                          </>
                        ) : (
                          <>
                            <span className="pricing-currency">$</span>
                            <span className="pricing-amount">
                              {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                            </span>
                            <span className="pricing-period">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="pricing-plan-features">
                      <h4>What's included:</h4>
                      <ul>
                        {plan.features.map((feature, idx) => (
                          <li key={idx}>
                            <CheckCircle size={16} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      {plan.limitations.length > 0 && (
                        <>
                          <h4>Limitations:</h4>
                          <ul className="pricing-limitations">
                            {plan.limitations.map((limitation, idx) => (
                              <li key={idx}>
                                <X size={16} />
                                {limitation}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>

                    <button 
                      className={`pricing-plan-button ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => navigate('/signup')}
                    >
                      {plan.monthlyPrice === 0 ? 'Get Started' : 'Get Started'}
                      <ArrowRight size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Comparison */}
          <section className="features-comparison">
            <div className="container">
              <div className="section-header">
                <h2>Compare Features</h2>
                <p>See what's included in each plan</p>
              </div>
              
              <div className="comparison-table">
                <div className="comparison-header">
                  <div className="feature-column">Features</div>
                  <div className="plan-column">Free Forever</div>
                  <div className="plan-column popular">Pro Plan</div>
                </div>
                
                <div className="comparison-row">
                  <div className="feature-name">Products</div>
                  <div className="plan-value">50</div>
                  <div className="plan-value">Unlimited</div>
                </div>
                
                <div className="comparison-row">
                  <div className="feature-name">Export Format</div>
                  <div className="plan-value">CSV</div>
                  <div className="plan-value">CSV</div>
                </div>
                
                <div className="comparison-row">
                  <div className="feature-name">Filters</div>
                  <div className="plan-value">Basic</div>
                  <div className="plan-value">Advanced</div>
                </div>
                
                <div className="comparison-row">
                  <div className="feature-name">Support</div>
                  <div className="plan-value">Customer support</div>
                  <div className="plan-value">Priority support</div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="pricing-faq">
            <div className="container">
              <div className="section-header">
                <h2>Frequently Asked Questions</h2>
                <p>Everything you need to know about our pricing</p>
              </div>
              
              <div className="faq-grid">
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h4>{faq.question}</h4>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="pricing-cta">
            <div className="container">
              <div className="cta-content">
                <h2>Ready to Get Started?</h2>
                <p>Join thousands of users who trust ScrapeMart for their data extraction needs</p>
                <div className="cta-buttons">
                  <button onClick={() => navigate('/signup')} className="btn-primary large">
                    Get Started
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

export default Pricing;
