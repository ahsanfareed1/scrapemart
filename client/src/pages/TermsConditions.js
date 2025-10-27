import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertCircle, CheckCircle, XCircle, Shield } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import './LegalPages.css';

const TermsConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <Header />
      
      <PageBanner 
        title="Terms and Conditions"
        subtitle="Last Updated: January 15, 2025"
        icon={<FileText size={32} />}
      />

      <div className="legal-content">
        <div className="container">
          <div className="legal-intro">
            <FileText size={48} />
            <p>
              Welcome to ScrapeMart. These Terms and Conditions ("Terms") govern your access to and use of 
              ScrapeMart's web scraping services. By using our service, you agree to be bound by these Terms.
            </p>
          </div>

          <div className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            
            <p>
              By creating an account, accessing, or using ScrapeMart, you agree to be bound by these Terms, 
              our Privacy Policy, and all applicable laws and regulations. If you do not agree with any part 
              of these Terms, you may not use our service.
            </p>

            <p>
              These Terms constitute a legally binding agreement between you ("User," "you," or "your") and 
              ScrapeMart Inc. ("ScrapeMart," "we," "us," or "our").
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Service Description</h2>
            
            <p>
              ScrapeMart provides web scraping services that allow users to extract publicly available product 
              data from Shopify and WooCommerce stores. Our services include:
            </p>
            <ul>
              <li>Automated web scraping and data extraction</li>
              <li>Data filtering and organization tools</li>
              <li>CSV and JSON export functionality</li>
              <li>Project management features</li>
              <li>API access (for Pro subscribers)</li>
              <li>Team collaboration tools</li>
            </ul>

            <p>
              We reserve the right to modify, suspend, or discontinue any aspect of the service at any time 
              without prior notice.
            </p>
          </div>

          <div className="legal-section">
            <h2>3. Account Registration</h2>
            
            <h3>Eligibility</h3>
            <p>
              You must be at least 18 years old to use ScrapeMart. By creating an account, you represent that 
              you have the legal capacity to enter into a binding agreement.
            </p>

            <h3>Account Security</h3>
            <p>You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Ensuring your account information is accurate and up-to-date</li>
            </ul>

            <h3>Account Termination</h3>
            <p>
              We reserve the right to suspend or terminate your account at any time for violations of these 
              Terms, fraudulent activity, or any other reason we deem appropriate.
            </p>
          </div>

          <div className="legal-section">
            <h2>4. Acceptable Use Policy</h2>
            
            <div className="acceptable-use">
              <div className="use-category allowed">
                <h3><CheckCircle size={24} /> Permitted Uses</h3>
                <ul>
                  <li>Scraping publicly accessible product data</li>
                  <li>Market research and competitive analysis</li>
                  <li>Store migration and catalog management</li>
                  <li>Price monitoring and comparison</li>
                  <li>Product research and sourcing</li>
                  <li>Academic and research purposes</li>
                </ul>
              </div>

              <div className="use-category prohibited">
                <h3><XCircle size={24} /> Prohibited Uses</h3>
                <ul>
                  <li>Scraping password-protected or private data</li>
                  <li>Bypassing authentication or security measures</li>
                  <li>Scraping personal information (PII) without consent</li>
                  <li>Violating robots.txt or website terms of service</li>
                  <li>Overloading or attacking target servers (DDoS)</li>
                  <li>Reselling scraped data without proper rights</li>
                  <li>Copyright or trademark infringement</li>
                  <li>Spamming or sending unsolicited communications</li>
                  <li>Using the service for illegal activities</li>
                  <li>Scraping websites that explicitly prohibit it</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="legal-section">
            <h2>5. Subscription Plans and Billing</h2>
            
            <h3>Free Plan</h3>
            <ul>
              <li>50 products per month</li>
              <li>1 project</li>
              <li>No credit card required</li>
              <li>Community support</li>
            </ul>

            <h3>Pro Plan ($14.99/month)</h3>
            <ul>
              <li>Unlimited products</li>
              <li>Unlimited projects</li>
              <li>API access</li>
              <li>Priority support</li>
              <li>Team collaboration</li>
            </ul>

            <h3>Billing Terms</h3>
            <ul>
              <li>Subscriptions are billed monthly or annually</li>
              <li>Charges are non-refundable except as required by law</li>
              <li>Auto-renewal can be disabled in account settings</li>
              <li>Price changes will be notified 30 days in advance</li>
              <li>Failed payments may result in service suspension</li>
            </ul>

            <h3>Cancellation</h3>
            <p>
              You may cancel your subscription at any time. You will retain access until the end of your 
              current billing period. No refunds will be provided for partial periods.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Intellectual Property Rights</h2>
            
            <h3>Our Intellectual Property</h3>
            <p>
              ScrapeMart and all related logos, trademarks, service marks, and trade names are owned by 
              ScrapeMart Inc. You may not use these without our prior written permission.
            </p>

            <p>
              The service, including all software, algorithms, designs, and documentation, is protected by 
              copyright, trademark, and other intellectual property laws.
            </p>

            <h3>Your Data</h3>
            <p>
              You retain all rights to data you upload or create using our service. We do not claim ownership 
              of your scraped data. However, you grant us a limited license to store and process your data 
              solely for the purpose of providing the service.
            </p>

            <h3>Scraped Data Rights</h3>
            <p>
              You are solely responsible for ensuring you have the right to scrape and use data extracted 
              through our service. We are not responsible for any copyright or intellectual property violations 
              resulting from your use of scraped data.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Rate Limits and Usage Restrictions</h2>
            
            <p>To ensure fair usage and service stability, we enforce the following limits:</p>
            
            <h3>Free Plan Limits</h3>
            <ul>
              <li>50 products per month</li>
              <li>5 concurrent scraping requests</li>
              <li>100 API requests per day (if applicable)</li>
            </ul>

            <h3>Pro Plan Limits</h3>
            <ul>
              <li>Unlimited products (fair use policy applies)</li>
              <li>50 concurrent scraping requests</li>
              <li>10,000 API requests per day</li>
            </ul>

            <h3>Fair Use Policy</h3>
            <p>
              "Unlimited" usage is subject to fair use policies. Excessive usage that impacts service 
              performance for other users may result in throttling or account suspension.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Data Privacy and Security</h2>
            
            <p>
              We take data privacy seriously. Please review our Privacy Policy for detailed information about 
              how we collect, use, and protect your data.
            </p>

            <p>Key points:</p>
            <ul>
              <li>We encrypt all data in transit and at rest</li>
              <li>We do not sell your personal information</li>
              <li>You can request data deletion at any time</li>
              <li>We comply with GDPR, CCPA, and other privacy regulations</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>9. Disclaimers and Limitations of Liability</h2>
            
            <h3>Service "As Is"</h3>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER 
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR 
              A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>

            <h3>No Guarantee of Accuracy</h3>
            <p>
              We do not guarantee the accuracy, completeness, or reliability of scraped data. Data may be 
              incomplete, outdated, or contain errors. You are responsible for verifying any data obtained 
              through our service.
            </p>

            <h3>Service Availability</h3>
            <p>
              While we strive for 99.9% uptime, we do not guarantee uninterrupted access to the service. 
              Maintenance, updates, and unforeseen issues may cause temporary disruptions.
            </p>

            <h3>Limitation of Liability</h3>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SCRAPEMART SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, 
              WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER 
              INTANGIBLE LOSSES.
            </p>

            <p>
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING 
              THE CLAIM, OR $100, WHICHEVER IS GREATER.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Indemnification</h2>
            
            <p>
              You agree to indemnify, defend, and hold harmless ScrapeMart, its officers, directors, 
              employees, and agents from any claims, liabilities, damages, losses, or expenses (including 
              legal fees) arising from:
            </p>
            <ul>
              <li>Your use or misuse of the service</li>
              <li>Violation of these Terms</li>
              <li>Violation of any third-party rights</li>
              <li>Your scraped data or how you use it</li>
              <li>Any fraudulent or illegal activity</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>11. Third-Party Services</h2>
            
            <p>
              Our service may integrate with or link to third-party services (payment processors, analytics, 
              etc.). We are not responsible for the privacy practices or content of these third parties. 
              Your use of third-party services is subject to their respective terms and policies.
            </p>
          </div>

          <div className="legal-section">
            <h2>12. Modifications to Terms</h2>
            
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of material changes by:
            </p>
            <ul>
              <li>Posting the updated Terms on our website</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending email notifications (for significant changes)</li>
            </ul>

            <p>
              Continued use of the service after changes constitutes acceptance of the modified Terms. If you 
              disagree with changes, you must discontinue use of the service.
            </p>
          </div>

          <div className="legal-section">
            <h2>13. Termination</h2>
            
            <h3>By You</h3>
            <p>
              You may terminate your account at any time through your account settings or by contacting support.
            </p>

            <h3>By Us</h3>
            <p>
              We may suspend or terminate your account immediately, without prior notice, for:
            </p>
            <ul>
              <li>Violation of these Terms</li>
              <li>Fraudulent activity or payment disputes</li>
              <li>Abusive or harmful behavior</li>
              <li>Legal or regulatory requirements</li>
              <li>Extended inactivity (90+ days)</li>
            </ul>

            <h3>Effect of Termination</h3>
            <p>
              Upon termination, you will lose access to your account and data. We may delete your data after 
              30 days. Export your data before terminating if you wish to retain it.
            </p>
          </div>

          <div className="legal-section">
            <h2>14. Dispute Resolution</h2>
            
            <h3>Governing Law</h3>
            <p>
              These Terms are governed by the laws of the State of California, United States, without regard 
              to conflict of law provisions.
            </p>

            <h3>Arbitration</h3>
            <p>
              Any disputes arising from these Terms or use of the service shall be resolved through binding 
              arbitration in accordance with the rules of the American Arbitration Association, rather than 
              in court, except that you may assert claims in small claims court if they qualify.
            </p>

            <h3>Class Action Waiver</h3>
            <p>
              You agree that disputes will be resolved on an individual basis and not as part of a class 
              action, consolidated proceeding, or representative action.
            </p>
          </div>

          <div className="legal-section">
            <h2>15. General Provisions</h2>
            
            <h3>Entire Agreement</h3>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and 
              ScrapeMart regarding use of the service.
            </p>

            <h3>Severability</h3>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions will 
              continue in full force and effect.
            </p>

            <h3>No Waiver</h3>
            <p>
              Our failure to enforce any right or provision of these Terms does not constitute a waiver of 
              that right or provision.
            </p>

            <h3>Assignment</h3>
            <p>
              You may not assign or transfer these Terms or your account without our written consent. We may 
              assign these Terms without restriction.
            </p>

            <h3>Force Majeure</h3>
            <p>
              We are not liable for any failure or delay in performance due to circumstances beyond our 
              reasonable control, including natural disasters, war, terrorism, riots, or internet outages.
            </p>
          </div>

          <div className="legal-section">
            <h2>16. Contact Information</h2>
            
            <p>For questions about these Terms, please contact us:</p>
            
            <div className="contact-info">
              <p><strong>Email:</strong> legal@scrapemart.com</p>
              <p><strong>Support:</strong> support@scrapemart.com</p>
              <p><strong>Support Hours:</strong> 24/7 Customer Support</p>
            </div>
          </div>

          <div className="legal-section">
            <h2><AlertCircle size={24} /> Important Notice</h2>
            
            <div className="notice-box">
              <p>
                <strong>Legal Responsibility:</strong> You are solely responsible for ensuring that your use 
                of ScrapeMart and any data you scrape complies with applicable laws and regulations in your 
                jurisdiction. ScrapeMart is a tool provider and does not endorse or encourage any specific 
                use of scraped data.
              </p>
              <p>
                <strong>Copyright Compliance:</strong> Respect the intellectual property rights of website 
                owners. Do not use scraped data in ways that violate copyright law, trademarks, or other 
                proprietary rights.
              </p>
              <p>
                <strong>Website Terms:</strong> Many websites have their own terms of service that may prohibit 
                scraping. It is your responsibility to review and comply with those terms.
              </p>
            </div>
          </div>

          <div className="legal-footer">
            <p>
              By using ScrapeMart, you acknowledge that you have read, understood, and agree to be bound by 
              these Terms and Conditions.
            </p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Back to Home
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsConditions;

