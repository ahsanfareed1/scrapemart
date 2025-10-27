const axios = require('axios');

class WooCommerceScraper {
  constructor() {
    this.baseHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    };
    this.progressCallback = null;
  }

  async requestWithRetry(url, options = {}, retries = 5, backoffMs = 1000) {
    let attempt = 0;
    let lastError;
    while (attempt <= retries) {
      try {
        const merged = {
          headers: this.baseHeaders,
          timeout: Math.max(options.timeout || 0, 30000),
          ...options
        };
        return await axios.get(url, merged);
      } catch (error) {
        lastError = error;
        if (attempt === retries) break;
        
        // Special handling for rate limiting (429)
        if (error.response?.status === 429) {
          const delay = Math.max(backoffMs * Math.pow(2, attempt), 5000);
          console.log(`Rate limited (429), waiting ${delay}ms before retry ${attempt + 1}/${retries}`);
          await new Promise(r => setTimeout(r, delay));
        } else {
          const delay = backoffMs * Math.pow(2, attempt);
          await new Promise(r => setTimeout(r, delay));
        }
        attempt++;
      }
    }
    throw lastError;
  }

  setProgressCallback(callback) {
    this.progressCallback = callback;
  }

  emitProgress(data) {
    if (this.progressCallback) {
      this.progressCallback(data);
    }
  }

  normalizeUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.origin;
    } catch (error) {
      throw new Error('Invalid URL format');
    }
  }

  async scrapeWooCommerceStore(url, page = 1, limit = 999999) {
    try {
      const storeUrl = this.normalizeUrl(url);
      const products = [];
      let totalProducts = 0;
      let hasMore = false;

      this.emitProgress({ status: 'starting', message: 'Starting to scrape WooCommerce store...', count: 0 });

      // Check if WooCommerce Store API is accessible
      let apiUrl = `${storeUrl}/wp-json/wc/store/products`;
      
      try {
        // Test the API endpoint first
        this.emitProgress({ status: 'testing', message: `Testing WooCommerce Store API at ${apiUrl}...`, count: 0 });
        
        const testResponse = await this.requestWithRetry(`${apiUrl}?page=1&per_page=1`, {
          headers: this.baseHeaders,
          timeout: 15000
        });
        
        console.log('WooCommerce API test response:', testResponse.status, testResponse.data);
        
        // Check if response is valid (should be an array of products)
        if (!testResponse.data) {
          throw new Error('No data received from WooCommerce Store API');
        }
        
        if (!Array.isArray(testResponse.data)) {
          console.log('Response is not an array, checking if it\'s a valid product object...');
          // Sometimes the API returns a single object instead of array
          if (typeof testResponse.data === 'object' && testResponse.data.id) {
            console.log('Single product object detected, this is valid');
          } else {
            throw new Error('Invalid response format from WooCommerce Store API - expected array of products');
          }
        }
        
        this.emitProgress({ status: 'testing', message: 'WooCommerce Store API is accessible!', count: 0 });
        
      } catch (error) {
        console.error('WooCommerce API test failed:', error.message);
        
        // Try alternative endpoints
        const alternativeEndpoints = [
          `${storeUrl}/wp-json/wc/v3/products`,
          `${storeUrl}/wp-json/wp/v2/products`,
          `${storeUrl}/products.json`
        ];
        
        let workingEndpoint = null;
        for (const endpoint of alternativeEndpoints) {
          try {
            this.emitProgress({ status: 'testing', message: `Trying alternative endpoint: ${endpoint}...`, count: 0 });
            const testResponse = await this.requestWithRetry(`${endpoint}?page=1&per_page=1`, {
              headers: this.baseHeaders,
              timeout: 10000
            });
            if (testResponse.data) {
              workingEndpoint = endpoint;
              this.emitProgress({ status: 'testing', message: `Found working endpoint: ${endpoint}`, count: 0 });
              break;
            }
          } catch (altError) {
            console.log(`Alternative endpoint ${endpoint} failed:`, altError.message);
          }
        }
        
        if (!workingEndpoint) {
          // Try one more fallback - check if it's a WordPress site with WooCommerce
          try {
            this.emitProgress({ status: 'testing', message: 'Checking if this is a WordPress site...', count: 0 });
            const wpResponse = await this.requestWithRetry(`${storeUrl}/wp-json/wp/v2/posts?per_page=1`, {
              headers: this.baseHeaders,
              timeout: 10000
            });
            
            if (wpResponse.data) {
              throw new Error(`This appears to be a WordPress site, but WooCommerce Store API is not accessible. The store may have WooCommerce installed but the Store API is disabled. Please contact the store owner to enable WooCommerce Store API in their settings.`);
            }
          } catch (wpError) {
            console.log('WordPress check failed:', wpError.message);
          }
          
          throw new Error(`WooCommerce Store API not accessible at ${apiUrl}. This could be because: 1) WooCommerce is not installed, 2) Store API is disabled in WooCommerce settings, 3) The store has security restrictions, 4) The URL is incorrect. Please try a different WooCommerce store or contact the store owner.`);
        }
        
        // Use the working endpoint
        apiUrl = workingEndpoint;
      }

      // Fetch all products by paginating through the API
      let currentPage = 1;
      const perPage = 100; // WooCommerce default max per page
      const allProducts = [];
      let consecutiveEmptyPages = 0;

      this.emitProgress({ status: 'paginating', message: 'Fetching additional pages...', count: totalProducts });

      while (currentPage <= 1000 && consecutiveEmptyPages < 2) { // Stop after 2 consecutive empty pages
        try {
          const response = await this.requestWithRetry(`${apiUrl}?page=${currentPage}&per_page=${perPage}`, {
            headers: this.baseHeaders,
            timeout: 30000
          });

          if (response.data) {
            let products = [];
            
            // Handle both array and single object responses
            if (Array.isArray(response.data)) {
              products = response.data;
            } else if (typeof response.data === 'object' && response.data.id) {
              products = [response.data];
            }
            
            if (products.length > 0) {
              // For variable products, fetch their variations
              for (let i = 0; i < products.length; i++) {
                const product = products[i];
                
                // Check if product has variations that need to be fetched
                if (product.type === 'variable' && Array.isArray(product.variations) && product.variations.length > 0) {
                  // Check if variations are just IDs (numbers) or full objects
                  const firstVariation = product.variations[0];
                  
                  if (typeof firstVariation === 'number') {
                    // Variations are just IDs, we need to fetch them
                    console.log(`Fetching ${product.variations.length} variations for product ${product.id}`);
                    
                    try {
                      // Try to fetch variations from the Store API
                      const variationsUrl = `${storeUrl}/wp-json/wc/store/products/${product.id}/variations`;
                      const variationsResponse = await this.requestWithRetry(variationsUrl, {
                        headers: this.baseHeaders,
                        timeout: 15000
                      });
                      
                      if (variationsResponse.data && Array.isArray(variationsResponse.data)) {
                        product.variations = variationsResponse.data;
                        console.log(`Fetched ${variationsResponse.data.length} variations for product ${product.id}`);
                      }
                    } catch (varError) {
                      console.log(`Could not fetch variations for product ${product.id}:`, varError.message);
                      // Keep the variation IDs, we'll handle them in the mapping
                    }
                    
                    // Small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 100));
                  }
                }
              }
              
              allProducts.push(...products);
              totalProducts = allProducts.length;
              
              console.log(`Fetched page ${currentPage}, ${products.length} products, total: ${totalProducts}`);
              
              // Process and emit batch of products
              const processedBatch = products.map(product => this.mapProductForStream(product, storeUrl));
              this.emitProgress({ 
                status: 'batch', 
                message: `Added page ${currentPage} (${products.length}) results`, 
                count: totalProducts, 
                products: processedBatch 
              });
              
              consecutiveEmptyPages = 0;
            } else {
              consecutiveEmptyPages++;
              console.log(`Page ${currentPage} returned no products. Empty pages: ${consecutiveEmptyPages}`);
            }
          } else {
            consecutiveEmptyPages++;
            console.log(`Page ${currentPage} returned no data. Empty pages: ${consecutiveEmptyPages}`);
          }
        } catch (error) {
          consecutiveEmptyPages++;
          console.log(`Page ${currentPage} failed:`, error.message);
        }
        
        currentPage++;
        
        // Add a small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Apply pagination to the scraped data
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = allProducts.slice(startIndex, endIndex);

      // Process products with pagination
      this.emitProgress({ status: 'processing', message: 'Processing products...', count: totalProducts });
      
      paginatedData.forEach((product, index) => {
        const processedProduct = this.mapProductForStream(product, storeUrl);
        products.push(processedProduct);
      });

      hasMore = endIndex < totalProducts;
      
      this.emitProgress({ status: 'complete', message: 'Scraping completed successfully!', count: totalProducts });

      return {
        products,
        total: totalProducts,
        hasMore,
        store: storeUrl,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        itemsPerPage: limit
      };
    } catch (error) {
      console.error('Error scraping WooCommerce store:', error);
      throw new Error(`Failed to scrape WooCommerce store: ${error.message}`);
    }
  }

  mapProductForStream(product, storeUrl) {
    // Extract price information from the prices object
    const prices = product.prices || {};
    const price = prices.price ? (parseFloat(prices.price) / 100).toFixed(2) : '0';
    const regularPrice = prices.regular_price ? (parseFloat(prices.regular_price) / 100).toFixed(2) : '0';
    const salePrice = prices.sale_price ? (parseFloat(prices.sale_price) / 100).toFixed(2) : '';
    
    return {
      // WooCommerce format
      id: product.id || '',
      name: product.name || 'Untitled Product',
      slug: product.slug || '',
      permalink: product.permalink || '',
      date_created: product.date_created || '',
      date_modified: product.date_modified || '',
      type: product.type || 'simple',
      status: product.status || 'publish',
      featured: product.featured || false,
      catalog_visibility: product.catalog_visibility || 'visible',
      description: product.description || '',
      short_description: product.short_description || '',
      sku: product.sku || '',
      price: price,
      regular_price: regularPrice,
      sale_price: salePrice,
      date_on_sale_from: product.date_on_sale_from || '',
      date_on_sale_to: product.date_on_sale_to || '',
      price_html: product.price_html || '',
      on_sale: product.on_sale || false,
      purchasable: product.purchasable || false,
      total_sales: product.total_sales || 0,
      virtual: product.virtual || false,
      downloadable: product.downloadable || false,
      downloads: product.downloads || [],
      download_limit: product.download_limit || -1,
      download_expiry: product.download_expiry || -1,
      external_url: product.external_url || '',
      button_text: product.button_text || '',
      tax_status: product.tax_status || 'taxable',
      tax_class: product.tax_class || '',
      manage_stock: product.manage_stock || false,
      stock_quantity: product.stock_quantity || null,
      stock_status: product.stock_status || 'instock',
      backorders: product.backorders || 'no',
      backorders_allowed: product.backorders_allowed || false,
      backordered: product.backordered || false,
      sold_individually: product.sold_individually || false,
      weight: product.weight || '',
      dimensions: product.dimensions || {},
      shipping_required: product.shipping_required || true,
      shipping_taxable: product.shipping_taxable || true,
      shipping_class: product.shipping_class || '',
      shipping_class_id: product.shipping_class_id || 0,
      reviews_allowed: product.reviews_allowed || true,
      average_rating: product.average_rating || '0',
      rating_count: product.review_count || product.rating_count || 0,
      related_ids: product.related_ids || [],
      upsell_ids: product.upsell_ids || [],
      cross_sell_ids: product.cross_sell_ids || [],
      parent_id: product.parent || product.parent_id || 0,
      purchase_note: product.purchase_note || '',
      categories: product.categories || [],
      tags: product.tags || [],
      images: product.images || [],
      attributes: product.attributes || [],
      default_attributes: product.default_attributes || [],
      variations: product.variations || [],
      grouped_products: product.grouped_products || [],
      menu_order: product.menu_order || 0,
      meta_data: product.meta_data || [],
      store_url: storeUrl,
      
      // Shopify format (for compatibility)
      title: product.name || 'Untitled Product',
      handle: product.slug || '',
      vendor: this.extractVendor(product),
      product_type: this.extractProductType(product),
      price_shopify: price,
      compare_at_price: regularPrice,
      currency: prices.currency_code || 'USD',
      images_shopify: this.convertImagesToShopify(product.images || []),
      description_shopify: product.description || '',
      tags_shopify: this.convertTagsToShopify(product.tags || []),
      published_at: product.date_created || new Date().toISOString(),
      available: product.stock_status === 'instock',
      url: product.permalink || `${storeUrl}/product/${product.slug || product.id}`,
      variants_shopify: this.convertVariantsToShopify(product)
    };
  }

  extractVendor(product) {
    // Try to extract vendor from categories or meta data
    if (product.categories && product.categories.length > 0) {
      return product.categories[0].name || 'Unknown';
    }
    return 'Unknown';
  }

  extractProductType(product) {
    if (product.categories && product.categories.length > 0) {
      return product.categories[0].name || '';
    }
    return product.type || '';
  }

  convertImagesToShopify(images) {
    return images.map(img => ({
      src: img.src || img.url || '',
      alt: img.alt || ''
    }));
  }

  convertTagsToShopify(tags) {
    return tags.map(tag => tag.name || tag).filter(Boolean);
  }

  convertVariantsToShopify(product) {
    console.log(`Converting variants for product ${product.id} (${product.name})`);
    console.log('Product type:', product.type);
    console.log('Product variations:', product.variations);
    console.log('Product attributes:', product.attributes);
    
    // For simple products, create a single variant
    if (product.type === 'simple' || !product.variations || product.variations.length === 0) {
      console.log('Creating single variant for simple product');
      return [{
        id: product.id,
        title: 'Default Title',
        price: product.prices?.price ? (parseFloat(product.prices.price) / 100).toFixed(2) : '0',
        sku: product.sku || '',
        available: product.stock_status === 'instock',
        stock_status: product.stock_status,
        stock_quantity: product.stock_quantity || 0,
        weight: product.weight || 0,
        image: product.images && product.images[0] ? (product.images[0].src || product.images[0].url) : ''
      }];
    }
    
    // For variable products, convert variation data
    // The WooCommerce Store API includes variation data in the response
    const variants = [];
    
    if (Array.isArray(product.variations)) {
      console.log(`Processing ${product.variations.length} variations`);
      
      product.variations.forEach((variation, index) => {
        console.log(`Variation ${index}:`, JSON.stringify(variation, null, 2));
        
        // Handle both variation objects and variation IDs
        if (typeof variation === 'object' && variation.id) {
          // Full variation object
          const variantPrice = variation.prices?.price ? (parseFloat(variation.prices.price) / 100).toFixed(2) : 
                              (product.prices?.price ? (parseFloat(product.prices.price) / 100).toFixed(2) : '0');
          
          const variantData = {
            id: variation.id,
            title: variation.name || `Variant ${index + 1}`,
            price: variantPrice,
            sku: variation.sku || '',
            available: variation.stock_status === 'instock',
            stock_status: variation.stock_status || 'instock',
            stock_quantity: variation.stock_quantity || 0,
            weight: variation.weight || product.weight || 0,
            attributes: variation.attributes || [],
            image: variation.image ? (variation.image.src || variation.image.url || variation.image) : ''
          };
          
          console.log('Created variant data:', variantData);
          variants.push(variantData);
        } else if (typeof variation === 'number') {
          // Just an ID - we'll need to handle this differently
          // For now, create a placeholder
          console.log(`Variation ${index} is just an ID: ${variation}`);
          variants.push({
            id: variation,
            title: `Variant ${index + 1}`,
            price: product.prices?.price ? (parseFloat(product.prices.price) / 100).toFixed(2) : '0',
            sku: product.sku ? `${product.sku}-${index}` : '',
            available: product.stock_status === 'instock',
            stock_status: product.stock_status,
            stock_quantity: 0,
            weight: product.weight || 0,
            attributes: [],
            image: ''
          });
        }
      });
    }
    
    console.log(`Returning ${variants.length} variants`);
    
    return variants.length > 0 ? variants : [{
      id: product.id,
      title: 'Default Title',
      price: product.prices?.price ? (parseFloat(product.prices.price) / 100).toFixed(2) : '0',
      sku: product.sku || '',
      available: product.stock_status === 'instock',
      stock_status: product.stock_status,
      stock_quantity: product.stock_quantity || 0,
      weight: product.weight || 0,
      image: product.images && product.images[0] ? (product.images[0].src || product.images[0].url) : ''
    }];
  }
}

// Create singleton instance
const wooCommerceScraper = new WooCommerceScraper();

// Export the main scraping function
module.exports = {
  scrapeWooCommerceStore: (url, page, limit) => wooCommerceScraper.scrapeWooCommerceStore(url, page, limit),
  WooCommerceScraper
};
