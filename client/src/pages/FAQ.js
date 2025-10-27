import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  HelpCircle,
  ArrowRight,
  Mail,
  MessageCircle,
  Phone
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import PageTransition from '../components/layout/PageTransition';
import './FAQ.css';

const FAQ = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState({});

  const faqCategories = [
    {
      title: "Getting Started",
      icon: <HelpCircle size={24} />,
      questions: [
        {
          question: "How do I get started with ScrapeMart?",
          answer: "Getting started is easy! Simply sign up for a free account, enter the store URL you want to scrape, configure your filters, and start extracting data. No coding required."
        },
        {
          question: "What types of stores can I scrape?",
          answer: "ScrapeMart supports Shopify stores and WooCommerce sites. We're constantly adding support for more e-commerce platforms."
        },
        {
          question: "Is there a free trial?",
          answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start."
        },
        {
          question: "What data can I extract?",
          answer: "You can extract product names, descriptions, prices, images, reviews, ratings, availability, categories, and more. The exact data depends on what's available on the store."
        }
      ]
    },
    {
      title: "Pricing & Billing",
      icon: <HelpCircle size={24} />,
      questions: [
        {
          question: "How does pricing work?",
          answer: "Our pricing is based on the number of products you scrape per month. We offer three plans: Starter (1,000 products), Professional (10,000 products), and Enterprise (unlimited)."
        },
        {
          question: "Can I change my plan anytime?",
          answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
        },
        {
          question: "What happens if I exceed my limits?",
          answer: "We'll notify you when you're approaching your limits. You can upgrade your plan or purchase additional credits to continue scraping."
        },
        {
          question: "Do you offer refunds?",
          answer: "We offer a 14-day free trial. If you're not satisfied within the trial period, you can cancel for a full refund."
        }
      ]
    },
    {
      title: "Technical Support",
      icon: <HelpCircle size={24} />,
      questions: [
        {
          question: "What if scraping fails?",
          answer: "Our system automatically retries failed requests. If scraping continues to fail, check if the store is accessible and contact our support team for assistance."
        },
        {
          question: "How accurate is the data?",
          answer: "We maintain 99.9% accuracy in our data extraction. Our advanced algorithms ensure reliable and consistent results."
        },
        {
          question: "Can I schedule automatic scraping?",
          answer: "Yes, Professional and Enterprise plans include scheduled scraping features. You can set up recurring scrapes to keep your data fresh."
        },
        {
          question: "Do you provide API access?",
          answer: "Yes, Professional and Enterprise plans include API access for integrating ScrapeMart with your existing systems."
        }
      ]
    },
    {
      title: "Data & Security",
      icon: <HelpCircle size={24} />,
      questions: [
        {
          question: "Is my data secure?",
          answer: "Absolutely. We use enterprise-grade security with SSL encryption, secure data centers, and comply with GDPR regulations."
        },
        {
          question: "How long is my data stored?",
          answer: "Your scraped data is stored securely for 30 days. You can download and export your data at any time."
        },
        {
          question: "Can I use proxy servers?",
          answer: "Yes, Enterprise plans include proxy support to help avoid IP blocking and access geo-restricted content."
        },
        {
          question: "Is scraping legal?",
          answer: "Scraping publicly available data is generally legal, but you should always respect robots.txt files and terms of service. We recommend checking with legal counsel for your specific use case."
        }
      ]
    }
  ];

  const handleToggle = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <PageTransition>
      <div className="faq-page">
        <Header />
        
        <PageBanner 
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about ScrapeMart"
          icon={<HelpCircle size={32} />}
        />

        <div className="faq-content">
          {/* Search Section */}
          <section className="search-section">
            <div className="container">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Categories */}
          <section className="faq-categories">
            <div className="container">
              {filteredCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="faq-category">
                  <div className="category-header">
                    <div className="category-icon">{category.icon}</div>
                    <h2>{category.title}</h2>
                  </div>
                  
                  <div className="questions-list">
                    {category.questions.map((item, questionIndex) => {
                      const key = `${categoryIndex}-${questionIndex}`;
                      const isOpen = openItems[key];
                      
                      return (
                        <div key={questionIndex} className="question-item">
                          <button
                            className="question-button"
                            onClick={() => handleToggle(categoryIndex, questionIndex)}
                          >
                            <span className="question-text">{item.question}</span>
                            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                          
                          {isOpen && (
                            <div className="answer-content">
                              <p>{item.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Support */}
          <section className="support-section">
            <div className="container">
              <div className="support-content">
                <h2>Still have questions?</h2>
                <p>Our support team is here to help you succeed</p>
                
                <div className="support-methods">
                  <div className="support-method">
                    <Mail size={24} />
                    <h4>Email Support</h4>
                    <p>Get help via email within 24 hours</p>
                    <a href="mailto:support@scrapemart.com">support@scrapemart.com</a>
                  </div>
                  
                  <div className="support-method">
                    <MessageCircle size={24} />
                    <h4>Live Chat</h4>
                    <p>Chat with our team in real-time</p>
                    <button className="btn-secondary">Start Chat</button>
                  </div>
                  
                  <div className="support-method">
                    <Phone size={24} />
                    <h4>Phone Support</h4>
                    <p>Call us for immediate assistance</p>
                    <a href="tel:+1-555-0123">+1 (555) 012-3456</a>
                  </div>
                </div>
                
                <div className="support-cta">
                  <button onClick={() => navigate('/contact')} className="btn-primary large">
                    Contact Support
                    <ArrowRight size={20} />
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

export default FAQ;
