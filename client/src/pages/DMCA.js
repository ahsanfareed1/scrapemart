import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Copyright } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import './LegalPages.css';

const DMCA = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <Header />
      
      <PageBanner 
        title="DMCA & Takedown Policy"
        subtitle="Copyright and intellectual property protection"
        icon={<Copyright size={32} />}
      />

      <div className="legal-content">
        <div className="container">
          <div className="legal-section">
            <p>
              If you believe scraped data violates your rights or Terms, email{' '}
              <a href="mailto:info@scrapemart.com">info@scrapemart.com</a> with:
            </p>
            
            <ul>
              <li>Your name and contact info</li>
              <li>URLs in question</li>
              <li>Legal basis (copyright, trademark, privacy, etc.)</li>
              <li>Good-faith statement and electronic signature</li>
            </ul>

            <p>
              We review valid requests and may remove related content or suspend jobs.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DMCA;

