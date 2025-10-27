import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import './LegalPages.css';

const TermsOfService = () => {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="legal-page">
      <Header />
      
      <PageBanner 
        title="Terms of Service"
        subtitle={`Effective: ${today}`}
        icon={<FileText size={32} />}
      />

      <div className="legal-content">
        <div className="container">
          <div className="legal-section">
            <p>
              ScrapeMart ("Service") provides tools to extract publicly available or authorized web data.
              By using this Service, you agree:
            </p>
            
            <ul>
              <li>You are solely responsible for ensuring legal and Terms of Service compliance.</li>
              <li>You will not bypass logins, paywalls, CAPTCHAs, IP blocks, or other protections.</li>
              <li>You will only target sources you are authorized to access.</li>
              <li>You will respect robots.txt and polite rate limits.</li>
              <li>You indemnify and hold harmless ScrapeMart from any misuse.</li>
            </ul>

            <p>
              The Service is provided "as is" without warranties. Liability limited to fees paid in the last 3 months.
            </p>
            
            <p>
              Contact: <a href="mailto:info@scrapemart.com">info@scrapemart.com</a>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;

