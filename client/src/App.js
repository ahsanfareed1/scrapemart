import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import TermsOfService from './pages/TermsOfService';
import AcceptableUse from './pages/AcceptableUse';
import Privacy from './pages/Privacy';
import Disclaimer from './pages/Disclaimer';
import DMCA from './pages/DMCA';
import ReportAbuse from './pages/ReportAbuse';
import Contact from './pages/Contact';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import ShopifyScraper from './pages/ShopifyScraper';
import WooCommerceScraper from './pages/WooCommerceScraper';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Documentation from './pages/Documentation';
import Tutorials from './pages/Tutorials';
import CaseStudies from './pages/CaseStudies';

import './App.css';

function App() {


  return (
    <Router>
      <AuthProvider>
    <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/acceptable-use" element={<AcceptableUse />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/dmca" element={<DMCA />} />
            <Route path="/report-abuse" element={<ReportAbuse />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/features" element={<Features />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shopify-scraper" element={<ShopifyScraper />} />
            <Route path="/woocommerce-scraper" element={<WooCommerceScraper />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
