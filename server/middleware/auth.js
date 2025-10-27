const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    console.log('Authenticating token...');
    // Verify the token with Supabase using anon key
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.log('Token verification failed:', error?.message);
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.log('Token verified for user:', user.id);

    // Get user profile using admin client for database access
    const supabaseAdmin = require('../config/supabase').supabaseAdmin;
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.log('Profile not found:', profileError.message);
      return res.status(401).json({ error: 'User profile not found' });
    }

    console.log('Profile found:', profile.subscription_tier);
    req.user = user;
    req.profile = profile;
    next();
  } catch (error) {
    console.log('Authentication error:', error.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const checkSubscription = (requiredTier = 'free') => {
  return (req, res, next) => {
    const { profile } = req;
    
    if (!profile) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const tierLevels = { free: 0, pro: 1 };
    const userTier = tierLevels[profile.subscription_tier] || 0;
    const requiredLevel = tierLevels[requiredTier] || 0;

    if (userTier < requiredLevel) {
      return res.status(403).json({ 
        error: `${requiredTier} subscription required`,
        upgradeRequired: true 
      });
    }

    next();
  };
};

const checkUsageLimit = async (req, res, next) => {
  try {
    const { profile } = req;
    
    if (!profile) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if user has reached their limit
    if (profile.subscription_tier === 'free' && profile.product_count >= profile.product_limit) {
      return res.status(403).json({ 
        error: 'Product limit reached. Please upgrade to Pro for unlimited products.',
        upgradeRequired: true 
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error checking usage limit' });
  }
};

module.exports = {
  authenticateToken,
  checkSubscription,
  checkUsageLimit,
};