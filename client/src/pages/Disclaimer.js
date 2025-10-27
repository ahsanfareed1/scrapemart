import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import './LegalPages.css';

const Disclaimer = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <Header />
      
      <PageBanner 
        title="Disclaimer"
        subtitle="Important legal information"
        icon={<AlertCircle size={32} />}
      />

      <div className="legal-content">
        <div className="container">
          <div className="legal-section">
            <p>
              ScrapeMart provides a neutral automation tool. Users control what data they target.
            </p>
            
            <p>
              Users are solely responsible for ensuring compliance with applicable laws and target site Terms.
            </p>
            
            <p>
              Nothing on this website is legal advice.
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

export default Disclaimer;

