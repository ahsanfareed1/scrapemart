import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import './Auth.css';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-grid">
          {/* Left Side - Context */}
          <div className="auth-content">
            <div className="auth-content-inner">
              <div className="auth-badge">
                <CheckCircle size={18} />
                <span>Password Assistance</span>
              </div>
              <h1>Forgot your password?</h1>
              <p className="auth-subtitle">
                Enter the email associated with your account and we’ll send a secure link
                to reset your password.
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="auth-form-section">
            <div className="auth-form-container">
              <div className="auth-form-header">
                <img src="/white_logo.png" alt="ScrapeMart" className="auth-logo" />
                <h2>Reset your password</h2>
                <p>Enter your email and we'll send you a reset link</p>
              </div>

              {error && (
                <div className="error-alert">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="success-alert">
                  <CheckCircle size={18} />
                  <span>Check your email for a password reset link</span>
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary large" disabled={loading || success}>
                  {loading ? 'Sending...' : success ? 'Email Sent!' : 'Send Reset Link'}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  Remember your password? <Link to="/signin">Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;



