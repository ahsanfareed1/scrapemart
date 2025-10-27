import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Send } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import './LegalPages.css';

const ReportAbuse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    targetUrls: '',
    description: '',
    legalBasis: '',
    signature: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.targetUrls || !formData.description || !formData.legalBasis || !formData.signature) {
      setError('Please fill in all fields');
      return;
    }

    // In a real implementation, this would send to your API
    // For now, we'll just show success message
    try {
      // Simulate API call
      console.log('Report submitted:', formData);
      
      // You can add actual API call here:
      // await fetch('/api/takedown', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        targetUrls: '',
        description: '',
        legalBasis: '',
        signature: ''
      });
    } catch (err) {
      setError('Failed to submit report. Please try again or email info@scrapemart.com directly.');
    }
  };

  return (
    <div className="legal-page">
      <Header />
      
      <PageBanner 
        title="Report Abuse"
        subtitle="Report violations or request content removal"
        icon={<AlertTriangle size={32} />}
      />

      <div className="legal-content">
        <div className="container">
          {submitted ? (
            <div className="legal-section">
              <div className="success-message" style={{
                background: '#f0fdf4',
                border: '2px solid #22c55e',
                borderRadius: '0.75rem',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#166534', marginBottom: '1rem' }}>Report Submitted Successfully</h3>
                <p style={{ color: '#166534' }}>
                  Thank you for your report. We will review it and take appropriate action. 
                  You should receive a confirmation email at {formData.email || 'the address you provided'}.
                </p>
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="btn-secondary"
                  style={{ marginTop: '1rem' }}
                >
                  Submit Another Report
                </button>
              </div>
            </div>
          ) : (
            <div className="legal-section">
              <p style={{ marginBottom: '2rem' }}>
                Use this form to report abuse, copyright violations, or request takedown of scraped content.
              </p>

              {error && (
                <div style={{
                  background: '#fef2f2',
                  border: '2px solid #dc2626',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  color: '#991b1b'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#134575' }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#134575' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#134575' }}>
                    Target URL(s) *
                  </label>
                  <textarea
                    name="targetUrls"
                    value={formData.targetUrls}
                    onChange={handleChange}
                    required
                    rows="3"
                    placeholder="Enter the URLs in question (one per line)"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#134575' }}>
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Describe the issue in detail"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#134575' }}>
                    Legal Basis *
                  </label>
                  <select
                    name="legalBasis"
                    value={formData.legalBasis}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Select legal basis</option>
                    <option value="copyright">Copyright Infringement</option>
                    <option value="trademark">Trademark Violation</option>
                    <option value="privacy">Privacy Violation</option>
                    <option value="terms">Terms of Service Violation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#134575' }}>
                    Signature (Type your full name) *
                  </label>
                  <input
                    type="text"
                    name="signature"
                    value={formData.signature}
                    onChange={handleChange}
                    required
                    placeholder="Type your full name as electronic signature"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  />
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    By typing your name, you certify that the information provided is accurate and made in good faith.
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '1rem'
                  }}
                >
                  <Send size={20} />
                  Submit Report
                </button>
              </form>
            </div>
          )}

          <div className="legal-section">
            <h3>Alternative Contact</h3>
            <p>
              You can also email reports directly to: <a href="mailto:info@scrapemart.com">info@scrapemart.com</a>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ReportAbuse;

