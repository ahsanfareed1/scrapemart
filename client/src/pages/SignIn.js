import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight, CheckCircle, Shield, Zap, Users } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import './Auth.css';

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    setLoading(true);

    const { data, error } = await signIn(formData.email, formData.password);

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
                  <Shield size={20} />
                  <span>Secure & Trusted</span>
                </div>
                
                <h1>Welcome back to ScrapeMart</h1>
                <p className="auth-subtitle">
                  Access your dashboard and continue extracting valuable e-commerce data 
                  with our powerful scraping tools.
                </p>

                <div className="auth-features">
                  <div className="auth-feature">
                    <CheckCircle size={20} />
                    <span>Advanced data extraction</span>
                  </div>
                  <div className="auth-feature">
                    <CheckCircle size={20} />
                    <span>Real-time monitoring</span>
                  </div>
                  <div className="auth-feature">
                    <CheckCircle size={20} />
                    <span>Export in multiple formats</span>
                  </div>
                </div>

                <div className="auth-stats">
                  <div className="auth-stat">
                    <Users size={24} />
                    <div>
                      <h3>50K+</h3>
                      <p>Active Users</p>
                    </div>
                  </div>
                  <div className="auth-stat">
                    <Zap size={24} />
                    <div>
                      <h3>99.9%</h3>
                      <p>Uptime</p>
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
                  <h2>Sign In</h2>
                  <p>Enter your credentials to access your account</p>
                </div>

                {error && (
                  <div className="error-alert">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
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

                  <div className="form-footer">
                    <Link to="/forgot-password" className="forgot-link">
                      Forgot password?
                    </Link>
                  </div>

                  <button type="submit" className="btn-primary large" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                    <ArrowRight size={20} />
                  </button>

                  <div className="auth-divider">
                    <span>or</span>
                  </div>

                  <button type="button" className="google-signin-btn" onClick={() => console.log('Google Sign In')}>
                    <svg className="google-icon" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </button>

                  <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
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

export default SignIn;



