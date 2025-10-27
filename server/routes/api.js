const express = require('express');
const router = express.Router();
const { authenticateToken, checkSubscription, checkUsageLimit } = require('../middleware/auth');
const { scrapeShopifyStore } = require('../services/shopifyScraper');
const supabase = require('../config/supabase');

// Scrape products endpoint
router.post('/scrape', authenticateToken, checkUsageLimit, async (req, res) => {
  try {
    const { url, type, projectId } = req.body;
    const { user, profile } = req;

    if (!url) {
      return res.status(400).json({ error: 'Store URL is required' });
    }

    // Scrape the store
    const result = await scrapeShopifyStore(url, type || 'products', 1, 999999);

    // Return the scraped data (products will be saved in the frontend)
    res.json({
      success: true,
      data: result,
      message: `Successfully scraped ${result.products?.length || 0} products`
    });

  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to scrape store' 
    });
  }
});

// Get projects for user
router.get('/projects', authenticateToken, async (req, res) => {
  try {
    const { user } = req;

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data: projects || [] });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create new project
router.post('/projects', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { name, description, store_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert([{
        user_id: user.id,
        name,
        description,
        store_url
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const updates = req.body;

    const { data: project, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Get products for a project
router.get('/projects/:id/products', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * limit;

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('project_id', id)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({ success: true, data: products || [] });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get user stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { user } = req;

    // Get projects count
    const { count: projectCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get products count
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    res.json({
      success: true,
      data: {
        projects: projectCount || 0,
        products: productCount || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;













