import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, XCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import './LegalPages.css';

const AcceptableUse = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <Header />
      
      <PageBanner 
        title="Acceptable Use Policy"
        subtitle="Guidelines for proper use of ScrapeMart"
        icon={<Shield size={32} />}
      />

      <div className="legal-content">
        <div className="container">
          <div className="acceptable-use">
            <div className="use-category prohibited">
              <h3><XCircle size={24} /> Prohibited</h3>
              <ul>
                <li>Evading authentication or technical restrictions.</li>
                <li>Scraping sites whose Terms forbid automated access.</li>
                <li>Copying or republishing third-party content without permission.</li>
                <li>Collecting or selling personal/sensitive data without a lawful basis.</li>
                <li>Using the Service for unlawful competitive intelligence or catalog cloning.</li>
              </ul>
            </div>

            <div className="use-category allowed">
              <h3><CheckCircle size={24} /> Permitted</h3>
              <ul>
                <li>Exporting your own store data.</li>
                <li>Accessing publicly available, non-sensitive data at reasonable rates.</li>
              </ul>
            </div>
          </div>

          <div className="legal-section">
            <p>
              Violations may result in account termination.
            </p>
            <p>
              Report issues: <a href="/report-abuse">/report-abuse</a> or <a href="mailto:info@scrapemart.com">info@scrapemart.com</a>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AcceptableUse;

