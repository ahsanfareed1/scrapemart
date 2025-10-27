const express = require('express');
const router = express.Router();
const { authenticateToken, checkUsageLimit } = require('../middleware/auth');
const { scrapeShopifyStore } = require('../services/shopifyScraper');
const { scrapeWooCommerceStore } = require('../services/wooCommerceScraper');
const ShopifyScraper = require('../services/shopifyScraper').ShopifyScraper;
const WooCommerceScraper = require('../services/wooCommerceScraper').WooCommerceScraper;

// POST /api/scraper/scrape
router.post('/scrape', authenticateToken, checkUsageLimit, async (req, res) => {
  try {
    const { url, type = 'products', page = 1, limit } = req.body;
    
    // Set limit based on subscription tier
    const effectiveLimit = req.profile.subscription_tier === 'pro' ? 999999 : (limit || 50);
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    let shopifyUrl;
    try {
      const urlObj = new URL(url);
      shopifyUrl = urlObj.origin;
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log(`Scraping ${type} from: ${shopifyUrl} (limit: ${effectiveLimit})`);
    
    const results = await scrapeShopifyStore(shopifyUrl, type, page, effectiveLimit);
    
    res.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit: effectiveLimit,
        total: results.total,
        hasMore: results.hasMore
      }
    });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to scrape store',
      message: error.message 
    });
  }
});

// GET /api/scraper/collections/:storeId
router.get('/collections/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { page = 1, limit = 999999 } = req.query;
    
    // Reconstruct URL from storeId
    let url;
    if (storeId.includes('.')) {
      // Already a full domain (custom domain or myshopify domain provided)
      url = storeId.startsWith('http') ? storeId : `https://${storeId}`;
    } else {
      url = `https://${storeId}.myshopify.com`;
    }
    
    const results = await scrapeShopifyStore(url, 'collections', page, limit);
    
    res.json({
      success: true,
      data: results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: results.total,
        hasMore: results.hasMore
      }
    });
  } catch (error) {
    console.error('Collections scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to scrape collections',
      message: error.message 
    });
  }
});

// GET /api/scraper/products/:storeId
router.get('/products/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { page = 1, limit = 999999 } = req.query;
    
    // Reconstruct URL from storeId
    let url;
    if (storeId.includes('.')) {
      url = storeId.startsWith('http') ? storeId : `https://${storeId}`;
    } else {
      url = `https://${storeId}.myshopify.com`;
    }
    
    const results = await scrapeShopifyStore(url, 'products', page, limit);
    
    res.json({
      success: true,
      data: results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: results.total,
        hasMore: results.hasMore
      }
    });
  } catch (error) {
    console.error('Products scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to scrape products',
      message: error.message 
    });
  }
});

// GET /api/scraper/scrape-stream - Real-time scraping with SSE
router.get('/scrape-stream', async (req, res) => {
  const { url, type = 'products', page = 1, collectionHandle, token } = req.query;
  
  console.log('Scrape-stream request:', { url, type, page, token: token ? 'present' : 'missing' });
  
  // Authenticate using token from query parameter (EventSource doesn't support headers)
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const supabase = require('../config/supabase');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.log('Token validation failed:', error?.message || 'No user');
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.log('User authenticated successfully:', user.id);

    // Get user profile using admin client for database access
    const supabaseAdmin = require('../config/supabase').supabaseAdmin;
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return res.status(401).json({ error: 'User profile not found' });
    }

    req.user = user;
    req.profile = profile;
  } catch (authError) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
  
  if (!url) {
    res.write(`data: ${JSON.stringify({ status: 'error', message: 'URL is required' })}\n\n`);
    return res.end();
  }

  // Set limit for scraping (no database limits needed)
  const effectiveLimit = 999999;

  // Validate URL
  let shopifyUrl;
  try {
    const urlObj = new URL(url);
    shopifyUrl = urlObj.origin;
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders && res.flushHeaders();

  // Heartbeat to keep connection alive on proxies
  const keepAlive = setInterval(() => {
    try {
      res.write(`: keep-alive\n\n`);
    } catch (_) {
      clearInterval(keepAlive);
    }
  }, 15000);

  // Create a new scraper instance for this request
  const scraperInstance = new ShopifyScraper();
  
  // Set up progress callback for real-time updates only
  scraperInstance.setProgressCallback((progressData) => {
    res.write(`data: ${JSON.stringify(progressData)}\n\n`);
  });

  try {
    console.log(`SSE Scraping ${type} from: ${shopifyUrl} (limit: ${effectiveLimit})`);
    
    const results = await scraperInstance.scrapeShopifyStore(
      shopifyUrl, 
      type, 
      parseInt(page), 
      effectiveLimit, 
      collectionHandle
    );
    
    // Send final result
    res.write(`data: ${JSON.stringify({ 
      status: 'complete', 
      results,
      pagination: {
        page: parseInt(page),
        limit: effectiveLimit,
        total: results.total,
        hasMore: results.hasMore
      }
    })}\n\n`);
    
    clearInterval(keepAlive);
    res.end();
  } catch (error) {
    console.error('SSE Scraping error:', error);
    res.write(`data: ${JSON.stringify({ 
      status: 'error', 
      message: error.message 
    })}\n\n`);
    clearInterval(keepAlive);
    res.end();
  }

  // Cleanup if client disconnects
  req.on('close', () => {
    clearInterval(keepAlive);
    try {
      res.end();
    } catch (_) {}
  });
});

// POST /api/scraper/collection-products
router.post('/collection-products', authenticateToken, checkUsageLimit, async (req, res) => {
  try {
    const { url, collectionHandle, page = 1, limit = 999999 } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    if (!collectionHandle) {
      return res.status(400).json({ error: 'Collection handle is required' });
    }

    // Validate URL
    let shopifyUrl;
    try {
      const urlObj = new URL(url);
      shopifyUrl = urlObj.origin;
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log(`Scraping products from collection ${collectionHandle} in: ${shopifyUrl}`);
    
    const results = await scrapeShopifyStore(shopifyUrl, 'products', page, limit, collectionHandle);
    
    res.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total: results.total,
        hasMore: results.hasMore
      }
    });
  } catch (error) {
    console.error('Collection products scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to scrape collection products',
      message: error.message 
    });
  }
});

// GET /api/scraper/woocommerce-stream - Real-time WooCommerce scraping with SSE
router.get('/woocommerce-stream', async (req, res) => {
  const { url, page = 1, token } = req.query;
  
  console.log('WooCommerce stream request:', { url, page, token: token ? 'present' : 'missing' });
  
  // Authenticate using token from query parameter
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const supabase = require('../config/supabase');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.log('WooCommerce authentication failed:', error?.message || 'No user');
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.log('WooCommerce user authenticated successfully:', user.id);

    // Get user profile using admin client for database access
    const supabaseAdmin = require('../config/supabase').supabaseAdmin;
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return res.status(401).json({ error: 'User profile not found' });
    }

    req.user = user;
    req.profile = profile;
  } catch (authError) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
  
  if (!url) {
    res.write(`data: ${JSON.stringify({ status: 'error', message: 'URL is required' })}\n\n`);
    return res.end();
  }

  // Set limit for scraping (no database limits needed)
  const effectiveLimit = 999999;

  // Validate URL
  let storeUrl;
  try {
    const urlObj = new URL(url);
    storeUrl = urlObj.origin;
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders && res.flushHeaders();

  // Heartbeat to keep connection alive
  const keepAlive = setInterval(() => {
    try {
      res.write(`: keep-alive\n\n`);
    } catch (_) {
      clearInterval(keepAlive);
    }
  }, 15000);

  // Create a new WooCommerce scraper instance
  const scraperInstance = new WooCommerceScraper();
  
  // Set up progress callback for real-time updates only
  scraperInstance.setProgressCallback((progressData) => {
    res.write(`data: ${JSON.stringify(progressData)}\n\n`);
  });

  try {
    console.log(`SSE WooCommerce Scraping from: ${storeUrl} (limit: ${effectiveLimit})`);
    
    const results = await scraperInstance.scrapeWooCommerceStore(
      storeUrl, 
      parseInt(page), 
      effectiveLimit
    );
    
    // Send final result
    res.write(`data: ${JSON.stringify({ 
      status: 'complete', 
      results,
      pagination: {
        page: parseInt(page),
        limit: effectiveLimit,
        total: results.total,
        hasMore: results.hasMore
      }
    })}\n\n`);
    
    clearInterval(keepAlive);
    res.end();
  } catch (error) {
    console.error('SSE WooCommerce Scraping error:', error);
    res.write(`data: ${JSON.stringify({ 
      status: 'error', 
      message: error.message 
    })}\n\n`);
    clearInterval(keepAlive);
    res.end();
  }

  // Cleanup if client disconnects
  req.on('close', () => {
    clearInterval(keepAlive);
    try {
      res.end();
    } catch (_) {}
  });
});

// POST /api/scraper/track-usage - Track product exports
router.post('/track-usage', authenticateToken, async (req, res) => {
  try {
    const { productCount } = req.body;
    const userId = req.user.id;
    const supabase = require('../config/supabase');

    if (!productCount || productCount < 0) {
      return res.status(400).json({ error: 'Invalid product count' });
    }

    // Get current profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Update product count
    const newCount = (profile.product_count || 0) + productCount;
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ product_count: newCount })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating product count:', updateError);
      return res.status(500).json({ error: 'Failed to update usage' });
    }

    res.json({ 
      success: true, 
      newCount,
      limit: profile.product_limit
    });
  } catch (error) {
    console.error('Track usage error:', error);
    res.status(500).json({ error: 'Failed to track usage' });
  }
});

// POST /api/scraper/reset-usage - Reset monthly usage (for testing or admin)
router.post('/reset-usage', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const supabase = require('../config/supabase');

    const { error } = await supabase
      .from('profiles')
      .update({ product_count: 0 })
      .eq('id', userId);

    if (error) {
      console.error('Error resetting product count:', error);
      return res.status(500).json({ error: 'Failed to reset usage' });
    }

    res.json({ success: true, message: 'Usage reset successfully' });
  } catch (error) {
    console.error('Reset usage error:', error);
    res.status(500).json({ error: 'Failed to reset usage' });
  }
});

module.exports = router;
