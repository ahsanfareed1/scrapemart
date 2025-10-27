import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, Database, Users, Mail } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import './LegalPages.css';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <Header />
      
      <PageBanner 
        title="Privacy Policy"
        subtitle="Last Updated: January 15, 2025"
        icon={<Shield size={32} />}
      />

      <div className="legal-content">
        <div className="container">
          <div className="legal-intro">
            <Shield size={48} />
            <p>
              At ScrapeMart, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our web scraping service.
            </p>
          </div>

          <div className="legal-section">
            <h2><Database size={24} /> Information We Collect</h2>
            
            <h3>Personal Information</h3>
            <p>
              When you register for an account, we collect:
            </p>
            <ul>
              <li>Full name</li>
              <li>Email address</li>
              <li>Company name (optional)</li>
              <li>Billing information (processed securely through our payment provider)</li>
              <li>Account credentials (password is encrypted)</li>
            </ul>

            <h3>Usage Information</h3>
            <p>
              We automatically collect certain information when you use our service:
            </p>
            <ul>
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on pages</li>
              <li>Scraping activities (URLs scraped, data volumes, timestamps)</li>
              <li>API usage statistics</li>
              <li>Error logs and performance data</li>
            </ul>

            <h3>Scraped Data</h3>
            <p>
              When you use our scraping service, we temporarily process and store:
            </p>
            <ul>
              <li>URLs of websites you scrape</li>
              <li>Product data extracted from those websites</li>
              <li>Export files (CSV, JSON) you generate</li>
              <li>Project configurations and filters</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2><Eye size={24} /> How We Use Your Information</h2>
            
            <p>We use the collected information for the following purposes:</p>
            
            <h3>Service Delivery</h3>
            <ul>
              <li>To create and manage your account</li>
              <li>To process your scraping requests</li>
              <li>To store and provide access to your scraped data</li>
              <li>To send you service-related notifications</li>
              <li>To provide customer support</li>
            </ul>

            <h3>Service Improvement</h3>
            <ul>
              <li>To analyze usage patterns and improve our algorithms</li>
              <li>To optimize scraping performance and reliability</li>
              <li>To develop new features and services</li>
              <li>To fix bugs and technical issues</li>
            </ul>

            <h3>Business Operations</h3>
            <ul>
              <li>To process payments and prevent fraud</li>
              <li>To enforce our Terms of Service</li>
              <li>To comply with legal obligations</li>
              <li>To send marketing communications (with your consent)</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2><Lock size={24} /> Data Security</h2>
            
            <p>
              We implement industry-standard security measures to protect your data:
            </p>
            <ul>
              <li><strong>Encryption:</strong> All data in transit is encrypted using TLS 1.3. Sensitive data at rest is encrypted using AES-256.</li>
              <li><strong>Access Controls:</strong> Strict access controls ensure only authorized personnel can access your data.</li>
              <li><strong>Authentication:</strong> Passwords are hashed using bcrypt. We support two-factor authentication (2FA).</li>
              <li><strong>Infrastructure:</strong> Our servers are hosted in secure, SOC 2 compliant data centers.</li>
              <li><strong>Monitoring:</strong> 24/7 security monitoring and regular security audits.</li>
              <li><strong>Backups:</strong> Regular automated backups with encryption.</li>
            </ul>

            <p>
              However, no method of transmission over the internet is 100% secure. While we strive to 
              protect your personal information, we cannot guarantee absolute security.
            </p>
          </div>

          <div className="legal-section">
            <h2><Users size={24} /> Data Sharing and Disclosure</h2>
            
            <h3>We Do NOT Sell Your Data</h3>
            <p>
              We never sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>

            <h3>Service Providers</h3>
            <p>
              We share data with trusted third-party service providers who assist us in operating our service:
            </p>
            <ul>
              <li>Cloud hosting providers (AWS, Google Cloud)</li>
              <li>Payment processors (Stripe)</li>
              <li>Email service providers</li>
              <li>Analytics providers (Google Analytics)</li>
              <li>Customer support tools</li>
            </ul>
            <p>
              These providers are contractually obligated to protect your data and use it only for providing services to us.
            </p>

            <h3>Legal Requirements</h3>
            <p>
              We may disclose your information if required to do so by law or in response to valid requests 
              by public authorities (e.g., court orders, subpoenas).
            </p>

            <h3>Business Transfers</h3>
            <p>
              If ScrapeMart is involved in a merger, acquisition, or sale of assets, your information may be 
              transferred. We will notify you before your information becomes subject to a different Privacy Policy.
            </p>
          </div>

          <div className="legal-section">
            <h2><Database size={24} /> Data Retention</h2>
            
            <p>We retain your information for as long as necessary to provide our services and comply with legal obligations:</p>
            <ul>
              <li><strong>Account Information:</strong> Retained while your account is active and for 30 days after deletion.</li>
              <li><strong>Scraped Data:</strong> Retained for 90 days or until you delete it, whichever comes first.</li>
              <li><strong>Export Files:</strong> Retained for 30 days after generation.</li>
              <li><strong>Usage Logs:</strong> Retained for 12 months for security and debugging purposes.</li>
              <li><strong>Billing Records:</strong> Retained for 7 years to comply with tax regulations.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2><Shield size={24} /> Your Rights</h2>
            
            <p>You have the following rights regarding your personal data:</p>
            
            <h3>Access and Portability</h3>
            <ul>
              <li>Request a copy of all personal data we hold about you</li>
              <li>Export your scraped data at any time</li>
              <li>Receive your data in a machine-readable format</li>
            </ul>

            <h3>Correction and Deletion</h3>
            <ul>
              <li>Update or correct your account information</li>
              <li>Delete your account and associated data</li>
              <li>Request deletion of specific scraped data</li>
            </ul>

            <h3>Control and Objection</h3>
            <ul>
              <li>Opt-out of marketing communications</li>
              <li>Disable cookies (may affect functionality)</li>
              <li>Object to automated decision-making</li>
              <li>Restrict processing of your data</li>
            </ul>

            <p>
              To exercise these rights, contact us at privacy@scrapemart.com. We will respond within 30 days.
            </p>
          </div>

          <div className="legal-section">
            <h2>Cookies and Tracking</h2>
            
            <p>We use cookies and similar tracking technologies to enhance your experience:</p>
            
            <h3>Essential Cookies</h3>
            <p>Required for authentication and basic functionality. Cannot be disabled.</p>

            <h3>Analytics Cookies</h3>
            <p>Help us understand how users interact with our service. You can opt-out in your account settings.</p>

            <h3>Preference Cookies</h3>
            <p>Remember your settings and preferences.</p>

            <p>
              Most browsers allow you to control cookies through settings. However, disabling cookies may 
              limit your ability to use certain features.
            </p>
          </div>

          <div className="legal-section">
            <h2>Children's Privacy</h2>
            
            <p>
              ScrapeMart is not intended for users under the age of 18. We do not knowingly collect personal 
              information from children. If you believe we have collected information from a child, please 
              contact us immediately at privacy@scrapemart.com.
            </p>
          </div>

          <div className="legal-section">
            <h2>International Data Transfers</h2>
            
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. 
              These countries may have different data protection laws. We ensure appropriate safeguards are in place 
              to protect your data, including:
            </p>
            <ul>
              <li>Standard contractual clauses approved by regulatory authorities</li>
              <li>Data processing agreements with all third-party processors</li>
              <li>Compliance with GDPR, CCPA, and other applicable regulations</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>Changes to This Privacy Policy</h2>
            
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul>
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending you an email notification (for significant changes)</li>
            </ul>
            <p>
              Your continued use of ScrapeMart after changes constitutes acceptance of the updated policy.
            </p>
          </div>

          <div className="legal-section">
            <h2><Mail size={24} /> Contact Us</h2>
            
            <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
            
            <div className="contact-info">
              <p><strong>Email:</strong> privacy@scrapemart.com</p>
              <p><strong>Support:</strong> support@scrapemart.com</p>
              <p><strong>Support Hours:</strong> 24/7 Customer Support</p>
            </div>

            <p>
              For data protection inquiries in the EU, you can also contact our Data Protection Officer at dpo@scrapemart.com.
            </p>
          </div>

          <div className="legal-footer">
            <p>
              By using ScrapeMart, you acknowledge that you have read and understood this Privacy Policy 
              and agree to its terms.
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

export default PrivacyPolicy;

