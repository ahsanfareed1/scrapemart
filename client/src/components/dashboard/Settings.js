import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { profile, updateProfile, updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    company_name: profile?.company_name || '',
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const { error } = await updateProfile(profileData);

    if (error) {
      setError(error);
    } else {
      setSuccess('Profile updated successfully!');
    }

    setLoading(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { error } = await updatePassword(passwordData.newPassword);

    if (error) {
      setError(error);
    } else {
      setSuccess('Password updated successfully!');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    }

    setLoading(false);
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account settings and preferences</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      <div className="settings-card">
        <h3>Profile Information</h3>
        <form onSubmit={handleProfileUpdate}>
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <div className="input-with-icon">
              <User size={20} />
              <input
                type="text"
                id="full_name"
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                placeholder="John Doe"
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
                value={profile?.email || ''}
                disabled
              />
            </div>
            <p className="field-hint">Email cannot be changed</p>
          </div>

          <div className="form-group">
            <label htmlFor="company_name">Company Name (Optional)</label>
            <div className="input-with-icon">
              <User size={20} />
              <input
                type="text"
                id="company_name"
                value={profileData.company_name}
                onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                placeholder="Your Company"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="settings-card">
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordUpdate}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="input-with-icon">
              <Lock size={20} />
              <input
                type="password"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="input-with-icon">
              <Lock size={20} />
              <input
                type="password"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      <div className="settings-card">
        <h3>Account Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Account Type</span>
            <span className="info-value">
              {profile?.subscription_tier === 'pro' ? 'Pro' : 'Free'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Products Used</span>
            <span className="info-value">
              {profile?.subscription_tier === 'pro' ? 'Unlimited' : `${profile?.product_count || 0} / ${profile?.product_limit || 50}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;














