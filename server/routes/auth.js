const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const supabase = require('../config/supabase');
const supabaseAdmin = require('../config/supabase').supabaseAdmin;
const { sendWelcomeEmail, sendPasswordResetEmail, sendVerificationEmail } = require('../services/emailService');
const { authenticateToken } = require('../middleware/auth');

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Create user in Supabase Auth with email confirmation disabled
    // We'll send our own custom welcome email
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm for server-side auth
      user_metadata: {
        full_name: fullName || email.split('@')[0]
      }
    });

    if (authError) {
      console.error('Signup error:', authError);
      return res.status(400).json({ error: authError.message });
    }

    // Create profile in database
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            full_name: fullName || email.split('@')[0],
            subscription_tier: 'free',
            product_limit: 50,
            product_count: 0
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

        // Send custom welcome email (from your domain)
      await sendWelcomeEmail(email, fullName || email.split('@')[0]);

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      res.json({
        success: true,
        user: authData.user,
        profile: profile,
        session: {
          access_token: 'session_created',
          user: authData.user
        },
        message: 'Account created successfully. Welcome email sent!'
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check credentials using admin client
    const { data: authData, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Signin error:', error);
      return res.status(401).json({ error: error.message });
    }

    // Fetch profile - using admin client to bypass RLS if needed
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    console.log('Profile data:', profile);

    res.json({
      success: true,
      user: authData.user,
      profile: profile || {
        id: authData.user.id,
        email: authData.user.email,
        full_name: authData.user.user_metadata?.full_name || email.split('@')[0],
        subscription_tier: 'free',
        subscription_status: 'active',
        product_count: 0,
        product_limit: 50
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at,
        expires_in: authData.session.expires_in,
        token_type: authData.session.token_type
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

// Sign out
router.post('/signout', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({ error: 'Failed to sign out' });
  }
});

// Request password reset (CUSTOM - No Supabase Pro needed!)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists by checking the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('email', email.toLowerCase())
      .single();
    
    if (profileError || !profile) {
      // Still return success to prevent email enumeration
      return res.json({ 
        success: true, 
        message: 'If an account exists with that email, a password reset link has been sent.' 
      });
    }

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // Store the token in the database
    const { error: insertError } = await supabase
      .from('password_reset_tokens')
      .insert([
        {
          user_id: profile.id,
          token: token,
          expires_at: expiresAt.toISOString(),
          used: false
        }
      ]);

    if (insertError) {
      console.error('Error storing reset token:', insertError);
      return res.status(500).json({ error: 'Failed to generate reset token' });
    }

    // Send custom password reset email with your domain
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    console.log('Attempting to send password reset email to:', email);
    const emailResult = await sendPasswordResetEmail(email, resetUrl, profile?.full_name);
    
    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      // Still return success to user, but log the error
    }

    res.json({ 
      success: true, 
      message: 'Password reset email sent. Please check your inbox.' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Reset password (CUSTOM - Uses our token system!)
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Find the token in the database
    const { data: resetToken, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single();

    if (tokenError || !resetToken) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(resetToken.expires_at);
    if (now > expiresAt) {
      return res.status(400).json({ error: 'Reset token has expired. Please request a new one.' });
    }

    // Use Supabase Admin to update the password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      resetToken.user_id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      return res.status(400).json({ error: 'Failed to reset password' });
    }

    // Mark token as used
    await supabase
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('token', token);

    res.json({ 
      success: true, 
      message: 'Password reset successful' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Get current user
router.get('/user', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
      profile: req.profile
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user profile
router.put('/user', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    const userId = req.user.id;

    // Update profile in database
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      success: true,
      user: req.user,
      profile: profile
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Downgrade to Free plan
router.post('/downgrade-to-free', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Update subscription_tier to free and reset limits
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_tier: 'free',
        product_limit: 50,
        product_count: 0
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error downgrading to free:', error);
      return res.status(400).json({ error: 'Failed to downgrade to free plan' });
    }

    res.json({
      success: true,
      message: 'Downgraded to free plan. Please cancel your subscription in Lemon Squeezy to stop future charges.',
      profile: profile
    });
  } catch (error) {
    console.error('Downgrade to free error:', error);
    res.status(500).json({ error: 'Failed to downgrade to free plan' });
  }
});

module.exports = router;

