import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in via localStorage
    const sessionData = localStorage.getItem('session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        console.log('Loading session from localStorage:', session);
        setUser(session.user);
        setProfile(session.profile);
        
        // If profile exists, log it for debugging
        if (session.profile) {
          console.log('Profile loaded:', session.profile.full_name, session.profile.subscription_tier);
        } else {
          console.warn('No profile data in session');
        }
      } catch (error) {
        console.error('Error parsing session:', error);
        localStorage.removeItem('session');
      }
    }
    setLoading(false);
  }, []);

  const fetchProfile = async () => {
    try {
      const sessionData = localStorage.getItem('session');
      if (!sessionData) return;

      const session = JSON.parse(sessionData);
      const response = await fetch(`${API_URL}/api/auth/user`, {
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        // Update stored profile
        session.profile = data.profile;
        localStorage.setItem('session', JSON.stringify(session));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email, password, fullName) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { data: null, error: data.error || 'Signup failed' };
      }

      // Store session
      const sessionData = {
        user: data.user,
        profile: data.profile || null,
        session: data.session || {}
      };
      localStorage.setItem('session', JSON.stringify(sessionData));
      setUser(data.user);
      setProfile(data.profile);

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { data: null, error: data.error || 'Signin failed' };
      }

      // Store session
      const sessionData = {
        user: data.user,
        profile: data.profile || null,
        session: data.session
      };
      localStorage.setItem('session', JSON.stringify(sessionData));
      setUser(data.user);
      setProfile(data.profile);

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const sessionData = localStorage.getItem('session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        await fetch(`${API_URL}/api/auth/signout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.session.access_token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      localStorage.removeItem('session');
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      localStorage.removeItem('session');
      setUser(null);
      setProfile(null);
    }
  };

  const resetPassword = async (email) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Failed to reset password' };
      }

      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem('session'));
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionData.session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Failed to update password' };
      }

      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem('session'));
      const response = await fetch(`${API_URL}/api/auth/user`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionData.session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Failed to update profile' };
      }

      // Update local state
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      sessionData.profile = updatedProfile;
      localStorage.setItem('session', JSON.stringify(sessionData));

      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };

  const refreshSession = async () => {
    // Not needed for server-side auth
    return { data: null, error: null };
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    logout: signOut, // Alias for compatibility
    resetPassword,
    updatePassword,
    updateProfile,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



