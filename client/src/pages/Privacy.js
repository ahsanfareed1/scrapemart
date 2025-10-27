import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import './LegalPages.css';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <Header />
      
      <PageBanner 
        title="Privacy Policy"
        subtitle="How we protect your data"
        icon={<Shield size={32} />}
      />

      <div className="legal-content">
        <div className="container">
          <div className="legal-section">
            <p>
              ScrapeMart collects limited data (account info, job logs, analytics) to operate and secure the Service.
            </p>
            
            <p>
              We do not sell personal data. Logs are stored briefly for debugging and compliance.
            </p>
            
            <p>
              Security: encrypted transmission, restricted access, audit logging.
            </p>
            
            <p>
              For privacy inquiries: <a href="mailto:info@scrapemart.com">info@scrapemart.com</a>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Privacy;

