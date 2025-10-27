import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, AlertCircle, Eye, EyeOff, ArrowRight, CheckCircle, Rocket, Zap, Users } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import './Auth.css';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [consentChecked, setConsentChecked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!consentChecked) {
      return setError('You must agree to the terms and conditions to continue');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    const { data, error } = await signUp(formData.email, formData.password, formData.fullName);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <PageTransition>
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-grid">
            {/* Left Side - Text Content */}
            <div className="auth-content">
              <div className="auth-content-inner">
                <div className="auth-badge">
                  <Rocket size={20} />
                  <span>Start for free</span>
                </div>
                
                <h1>Join ScrapeMart Today</h1>
                <p className="auth-subtitle">
                  Start extracting valuable e-commerce data with our powerful scraping tools. 
                  No coding required, export in seconds.
                </p>

                <div className="auth-features">
                  <div className="auth-feature">
                    <CheckCircle size={20} />
                    <span>14-day free trial</span>
                  </div>
                  <div className="auth-feature">
                    <CheckCircle size={20} />
                    <span>No credit card required</span>
                  </div>
                  <div className="auth-feature">
                    <CheckCircle size={20} />
                    <span>Cancel anytime</span>
                  </div>
                </div>

                <div className="auth-stats">
                  <div className="auth-stat">
                    <Users size={24} />
                    <div>
                      <h3>50K+</h3>
                      <p>Happy Users</p>
                    </div>
                  </div>
                  <div className="auth-stat">
                    <Zap size={24} />
                    <div>
                      <h3>10M+</h3>
                      <p>Products Scraped</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="auth-form-section">
              <div className="auth-form-container">
                <div className="auth-form-header">
                  <img src="/white_logo.png" alt="ScrapeMart" className="auth-logo" />
                  <h2>Create Account</h2>
                  <p>Start your free trial today</p>
                </div>

                {error && (
                  <div className="error-alert">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <div className="input-with-icon">
                      <User size={20} />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div className="input-with-icon">
                      <Mail size={20} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-with-icon password-input">
                      <Lock size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-with-icon password-input">
                      <Lock size={20} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '0.75rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      lineHeight: '1.5'
                    }}>
                      <input
                        type="checkbox"
                        checked={consentChecked}
                        onChange={(e) => setConsentChecked(e.target.checked)}
                        required
                        style={{
                          width: '18px',
                          height: '18px',
                          marginTop: '0.125rem',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      />
                      <span style={{ color: '#585859' }}>
                        I confirm I have the right to access the target data and my use complies with applicable laws and the target website's Terms. I will not bypass authentication, paywalls, rate limits, or other protections. I agree to the{' '}
                        <a href="/terms" target="_blank" style={{ color: '#1e9b96', textDecoration: 'underline' }}>Terms of Service</a>,{' '}
                        <a href="/acceptable-use" target="_blank" style={{ color: '#1e9b96', textDecoration: 'underline' }}>Acceptable Use Policy</a>, and{' '}
                        <a href="/privacy" target="_blank" style={{ color: '#1e9b96', textDecoration: 'underline' }}>Privacy Policy</a>.
                      </span>
                    </label>
                  </div>

                  

                  <button type="submit" className="btn-primary large" disabled={loading || !consentChecked}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                    <ArrowRight size={20} />
                  </button>

                  <div className="auth-divider">
                    <span>or</span>
                  </div>

                  <button type="button" className="google-signin-btn" onClick={() => console.log('Google Sign Up')}>
                    <svg className="google-icon" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign up with Google
                  </button>

                  <div className="auth-footer">
                    <p>Already have an account? <Link to="/signin">Sign in</Link></p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SignUp;



