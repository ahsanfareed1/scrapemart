import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, CreditCard, TrendingUp } from 'lucide-react';
import './Billing.css';

const Billing = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    
    try {
      console.log('Starting upgrade process...');
      
      // Get auth token for API call
      const token = localStorage.getItem('supabase.auth.token');
      const authToken = token ? JSON.parse(token).access_token : null;
      
      console.log('Auth token available:', !!authToken);
      
      // Call your Lemon Squeezy checkout endpoint
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        alert(`Error: ${errorData.error || 'Failed to create checkout session'}`);
        return;
      }

      const data = await response.json();
      console.log('Checkout data:', data);

      if (data.url) {
        console.log('Redirecting to:', data.url);
        window.location.href = data.url;
      } else {
        console.error('No URL in response:', data);
        alert('Error: No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/billing/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDowngrade = async () => {
    if (!window.confirm('Are you sure you want to downgrade to the Free plan? You will need to cancel your subscription in Lemon Squeezy to stop future charges.')) {
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('supabase.auth.token');
      const authToken = token ? JSON.parse(token).access_token : null;
      
      const response = await fetch('/api/auth/downgrade-to-free', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.error || 'Failed to downgrade'}`);
        return;
      }

      alert('Success! You have been downgraded to Free plan. Remember to cancel your subscription in Lemon Squeezy to stop future charges.');
      window.location.reload();
    } catch (error) {
      console.error('Error downgrading:', error);
      alert('Error: Failed to downgrade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="billing-page">
      <div className="page-header">
        <div>
          <h1>Billing & Subscription</h1>
          <p>Manage your subscription and billing information</p>
        </div>
      </div>

      <div className="current-plan-card">
        <div className="plan-header">
          <div>
            <h3>Current Plan</h3>
            <p className="plan-name">
              {profile?.subscription_tier === 'pro' ? 'Pro Plan' : 'Free Plan'}
            </p>
          </div>
          <div className="plan-badge">
            <TrendingUp size={20} />
            <span>{profile?.subscription_tier === 'pro' ? 'Active' : 'Free'}</span>
          </div>
        </div>

        <div className="usage-stats">
          <div className="usage-item">
            <span className="usage-label">Products Used</span>
            <span className="usage-value">
              {profile?.subscription_tier === 'pro' ? 'Unlimited' : `${profile?.product_count || 0} / ${profile?.product_limit || 50}`}
            </span>
          </div>
          {profile?.subscription_tier !== 'pro' && (
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min((profile?.product_count / profile?.product_limit) * 100, 100)}%` }}
              />
            </div>
          )}
        </div>

        {profile?.subscription_tier === 'pro' && (
          <button className="btn-secondary" onClick={handleManageBilling} disabled={loading}>
            <CreditCard size={18} /> Manage Billing
          </button>
        )}
        {profile?.subscription_tier === 'free' && (
          <p className="upgrade-text">Upgrade to Pro for unlimited products</p>
        )}
      </div>

      <div className="pricing-section">
        <h3>Available Plans</h3>
        <div className="pricing-grid">
          <div className={`pricing-card ${profile?.subscription_tier === 'free' ? 'current' : ''}`}>
            <div className="pricing-header">
              <h3>Free</h3>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">0</span>
                <span className="period">/month</span>
              </div>
            </div>
            <ul className="pricing-features">
              <li><CheckCircle size={16} /> 50 products per export</li>
              <li><CheckCircle size={16} /> Shopify & WooCommerce support</li>
              <li><CheckCircle size={16} /> CSV, Excel, and JSON export</li>
              <li><CheckCircle size={16} /> Filter by title, tags, collection, price, vendors</li>
              <li><CheckCircle size={16} /> Export Shopify to WooCommerce format</li>
              <li><CheckCircle size={16} /> Export WooCommerce to Shopify format</li>
              <li><CheckCircle size={16} /> Email support</li>
              <li><CheckCircle size={16} /> Basic filters</li>
            </ul>
            {profile?.subscription_tier === 'free' ? (
              <div className="current-plan-badge">Current Plan</div>
            ) : (
              <button 
                className="btn-secondary wide" 
                onClick={handleDowngrade} 
                disabled={loading}
              >
                Downgrade to Free Plan
              </button>
            )}
          </div>

          <div className={`pricing-card featured ${profile?.subscription_tier === 'pro' ? 'current' : ''}`}>
            <div className="featured-badge">Most Popular</div>
            <div className="pricing-header">
              <h3>Pro</h3>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">19.99</span>
                <span className="period">/month</span>
              </div>
            </div>
            <ul className="pricing-features">
              <li><CheckCircle size={16} /> Unlimited products</li>
              <li><CheckCircle size={16} /> Shopify & WooCommerce support</li>
              <li><CheckCircle size={16} /> All export formats (CSV, Excel, JSON)</li>
              <li><CheckCircle size={16} /> Advanced filtering options</li>
              <li><CheckCircle size={16} /> Export between formats</li>
              <li><CheckCircle size={16} /> Priority support</li>
              <li><CheckCircle size={16} /> 24/7 customer support</li>
              <li><CheckCircle size={16} /> All features included</li>
            </ul>
            {profile?.subscription_tier === 'pro' ? (
              <div className="current-plan-badge">Current Plan</div>
            ) : (
              <button className="btn-primary wide" onClick={handleUpgrade} disabled={loading}>
                {loading ? 'Loading...' : 'Upgrade to Pro'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;



