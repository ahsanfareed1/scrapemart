const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const supabase = require('../config/supabase');
const lemonSqueezy = require('../services/lemonSqueezy');

// Only initialize Stripe if the key is provided (keeping for backward compatibility)
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder_key_for_now') {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

// Create Lemon Squeezy checkout session
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    if (!lemonSqueezy.apiKey) {
      return res.status(503).json({ error: 'Lemon Squeezy not configured. Please add your Lemon Squeezy keys.' });
    }

    const { user, profile } = req;

    // Create Lemon Squeezy checkout session
    const checkout = await lemonSqueezy.createCheckout(
      user.email,
      user.user_metadata?.full_name || user.email,
      user.id
    );

    res.json({ 
      url: checkout.data.attributes.url,
      checkoutId: checkout.data.id 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Create Lemon Squeezy customer portal session
router.post('/create-portal-session', authenticateToken, async (req, res) => {
  try {
    const { profile } = req;

    if (!profile.lemon_squeezy_customer_id) {
      return res.status(400).json({ error: 'No billing information found' });
    }

    // Lemon Squeezy doesn't have a customer portal like Stripe
    // Instead, we'll redirect to their subscription management
    const subscriptionUrl = `https://app.lemonsqueezy.com/my-orders`;
    
    res.json({ url: subscriptionUrl });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

// Lemon Squeezy webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-signature'] || req.headers['x-squeezy-signature'];
    const payload = req.body;

    if (!signature) {
      console.error('No signature provided');
      return res.status(400).send('No signature provided');
    }

    // Verify webhook signature
    const isValid = lemonSqueezy.verifyWebhookSignature(
      payload,
      signature,
      process.env.LS_WEBHOOK_SECRET
    );

    if (!isValid) {
      console.error('Invalid webhook signature');
      return res.status(400).send('Invalid signature');
    }

    // Parse webhook event
    const event = lemonSqueezy.parseWebhookEvent(payload);

    console.log('Lemon Squeezy webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'order_created':
        await handleOrderCreated(event.data);
        break;
      case 'subscription_created':
        await handleSubscriptionCreated(event.data);
        break;
      case 'subscription_updated':
        await handleSubscriptionUpdated(event.data);
        break;
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(event.data);
        break;
      case 'order_refunded':
        await handleOrderRefunded(event.data);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Lemon Squeezy webhook handlers
async function handleOrderCreated(orderData) {
  const userId = orderData.attributes.custom_data?.user_id;
  
  if (!userId) return;

  console.log('Order created for user:', userId);

  // Update user profile to Pro
  await supabase
    .from('profiles')
    .update({
      subscription_tier: 'pro',
      lemon_squeezy_customer_id: orderData.attributes.customer_id,
      product_limit: 999999
    })
    .eq('id', userId);

  // Create subscription record if it's a subscription order
  if (orderData.attributes.subscription_id) {
    await supabase
      .from('subscriptions')
      .insert([{
        user_id: userId,
        lemon_squeezy_subscription_id: orderData.attributes.subscription_id,
        lemon_squeezy_order_id: orderData.id,
        status: 'active',
        current_period_start: new Date(orderData.attributes.created_at).toISOString(),
        current_period_end: new Date(orderData.attributes.renewed_at).toISOString(),
      }]);
  }
}

async function handleSubscriptionCreated(subscriptionData) {
  const userId = subscriptionData.attributes.custom_data?.user_id;
  
  if (!userId) return;

  console.log('Subscription created for user:', userId);

  // Update user profile to Pro
  await supabase
    .from('profiles')
    .update({
      subscription_tier: 'pro',
      lemon_squeezy_customer_id: subscriptionData.attributes.customer_id,
      product_limit: 999999
    })
    .eq('id', userId);

  // Create subscription record
  await supabase
    .from('subscriptions')
    .insert([{
      user_id: userId,
      lemon_squeezy_subscription_id: subscriptionData.id,
      status: subscriptionData.attributes.status,
      current_period_start: new Date(subscriptionData.attributes.created_at).toISOString(),
      current_period_end: new Date(subscriptionData.attributes.renewed_at).toISOString(),
    }]);
}

async function handleSubscriptionUpdated(subscriptionData) {
  const userId = subscriptionData.attributes.custom_data?.user_id;
  
  if (!userId) return;

  console.log('Subscription updated for user:', userId);

  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({
      status: subscriptionData.attributes.status,
      current_period_start: new Date(subscriptionData.attributes.created_at).toISOString(),
      current_period_end: new Date(subscriptionData.attributes.renewed_at).toISOString(),
    })
    .eq('lemon_squeezy_subscription_id', subscriptionData.id);

  // Update user profile based on subscription status
  const subscriptionTier = subscriptionData.attributes.status === 'active' ? 'pro' : 'free';
  const productLimit = subscriptionData.attributes.status === 'active' ? 999999 : 50;

  await supabase
    .from('profiles')
    .update({
      subscription_tier: subscriptionTier,
      product_limit: productLimit
    })
    .eq('id', userId);
}

async function handleSubscriptionCancelled(subscriptionData) {
  const userId = subscriptionData.attributes.custom_data?.user_id;
  
  if (!userId) return;

  console.log('Subscription cancelled for user:', userId);

  // Update user profile to Free
  await supabase
    .from('profiles')
    .update({
      subscription_tier: 'free',
      product_limit: 50
    })
    .eq('id', userId);

  // Update subscription status
  await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled'
    })
    .eq('lemon_squeezy_subscription_id', subscriptionData.id);
}

async function handleOrderRefunded(orderData) {
  const userId = orderData.attributes.custom_data?.user_id;
  
  if (!userId) return;

  console.log('Order refunded for user:', userId);

  // Update user profile to Free
  await supabase
    .from('profiles')
    .update({
      subscription_tier: 'free',
      product_limit: 50
    })
    .eq('id', userId);

  // Update subscription status if it exists
  if (orderData.attributes.subscription_id) {
    await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled'
      })
      .eq('lemon_squeezy_subscription_id', orderData.attributes.subscription_id);
  }
}

module.exports = router;
