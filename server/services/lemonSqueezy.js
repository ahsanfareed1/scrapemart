const axios = require('axios');
require('dotenv').config();

class LemonSqueezyService {
  constructor() {
    this.apiKey = process.env.LS_API_KEY;
    this.variantId = process.env.LS_VARIANT_ID_PAID;
    this.storeId = process.env.LS_STORE_ID;
    this.baseURL = 'https://api.lemonsqueezy.com/v1';
    
    console.log('Lemon Squeezy Service initialized:');
    console.log('API Key:', this.apiKey ? 'Configured' : 'NOT configured');
    console.log('Variant ID:', this.variantId);
    console.log('Store ID:', this.storeId);
    
    if (!this.apiKey) {
      console.warn('Lemon Squeezy API key not configured');
    }
  }

  // Create a checkout session
  async createCheckout(userEmail, userName, userId) {
    try {
      const response = await axios.post(
        `${this.baseURL}/checkouts`,
        {
          data: {
            type: 'checkouts',
            attributes: {
              checkout_data: {
                email: userEmail,
                name: userName,
                custom: {
                  user_id: userId
                }
              },
              checkout_options: {
                embed: false,
                media: false,
                logo: true
              },
              expires_at: null,
              preview: false,
              test_mode: process.env.NODE_ENV === 'development'
            },
            relationships: {
              store: {
                data: {
                  type: 'stores',
                  id: this.storeId
                }
              },
              variant: {
                data: {
                  type: 'variants',
                  id: this.variantId
                }
              }
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating Lemon Squeezy checkout:', error.response?.data || error.message);
      throw new Error('Failed to create checkout session');
    }
  }

  // Get checkout details
  async getCheckout(checkoutId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/checkouts/${checkoutId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/vnd.api+json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching checkout:', error.response?.data || error.message);
      throw new Error('Failed to fetch checkout details');
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/subscriptions/${subscriptionId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/vnd.api+json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching subscription:', error.response?.data || error.message);
      throw new Error('Failed to fetch subscription details');
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const response = await axios.patch(
        `${this.baseURL}/subscriptions/${subscriptionId}`,
        {
          data: {
            type: 'subscriptions',
            id: subscriptionId,
            attributes: {
              cancelled: true
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error cancelling subscription:', error.response?.data || error.message);
      throw new Error('Failed to cancel subscription');
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload, signature, secret) {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const digest = hmac.digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(digest, 'hex')
    );
  }

  // Parse webhook event
  parseWebhookEvent(payload) {
    try {
      return JSON.parse(payload);
    } catch (error) {
      console.error('Error parsing webhook payload:', error);
      throw new Error('Invalid webhook payload');
    }
  }
}

module.exports = new LemonSqueezyService();
