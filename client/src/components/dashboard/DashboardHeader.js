import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Settings, 
  CreditCard, 
  Users, 
  LogOut, 
  Sun, 
  Moon, 
  ChevronDown
} from 'lucide-react';
import './DashboardHeader.css';

const DashboardHeader = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Dashboard</h1>
        </div>
        
        <div className="header-right">
          {/* Dark Mode Toggle */}
          <button 
            className="theme-toggle"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Profile Dropdown */}
          <div className="profile-dropdown">
            <button 
              className="profile-trigger"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="profile-avatar">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.full_name || 'User'} 
                    className="avatar-image"
                  />
                ) : (
                  <span className="avatar-initials">
                    {getInitials(profile?.full_name)}
                  </span>
                )}
              </div>
              <div className="profile-info">
                <span className="profile-name">
                  {profile?.full_name || 'User'}
                </span>
                <span className="profile-plan">
                  {profile?.subscription_tier === 'pro' ? 'Pro Plan' : 'Free Plan'}
                </span>
              </div>
              <ChevronDown size={16} className={`chevron ${isProfileOpen ? 'open' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <div className="menu-avatar">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.full_name || 'User'} 
                        className="menu-avatar-image"
                      />
                    ) : (
                      <span className="menu-avatar-initials">
                        {getInitials(profile?.full_name)}
                      </span>
                    )}
                  </div>
                  <div className="menu-profile-info">
                    <div className="menu-name">
                      {profile?.full_name || 'User'}
                    </div>
                    <div className="menu-email">
                      {profile?.email || 'user@example.com'}
                    </div>
                  </div>
                </div>

                <div className="menu-divider"></div>

                <div className="menu-items">
                  <button 
                    className="menu-item"
                    onClick={() => {
                      navigate('/dashboard/settings');
                      setIsProfileOpen(false);
                    }}
                  >
                    <Settings size={18} />
                    <span>Account Settings</span>
                  </button>

                  <button 
                    className="menu-item"
                    onClick={() => {
                      navigate('/dashboard/billing');
                      setIsProfileOpen(false);
                    }}
                  >
                    <CreditCard size={18} />
                    <span>Billing & Plans</span>
                  </button>

                  <button 
                    className="menu-item"
                    onClick={() => {
                      navigate('/dashboard/team');
                      setIsProfileOpen(false);
                    }}
                  >
                    <Users size={18} />
                    <span>Team Management</span>
                  </button>
                </div>

                <div className="menu-divider"></div>

                <button 
                  className="menu-item logout-item"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;