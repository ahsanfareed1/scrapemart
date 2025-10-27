const axios = require('axios');
const cheerio = require('cheerio');

class ShopifyScraper {
  constructor() {
    this.baseHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };
    this.progressCallback = null;
  }

  getRandomUserAgent() {
    const agents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:118.0) Gecko/20100101 Firefox/118.0',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.92 Safari/537.36'
    ];
    return agents[Math.floor(Math.random() * agents.length)];
  }

  async requestWithRetry(url, options = {}, retries = 3, backoffMs = 1000) {
    let attempt = 0;
    let lastError;
    while (attempt <= retries) {
      try {
        const merged = {
          headers: { ...this.baseHeaders, 'User-Agent': this.getRandomUserAgent(), ...(options.headers || {}) },
          timeout: Math.max(options.timeout || 0, 30000),
          ...options
        };
        return await axios.get(url, merged);
      } catch (error) {
        lastError = error;
        if (attempt === retries) break;
        
        // Special handling for rate limiting (429)
        if (error.response?.status === 429) {
          const header = error.response.headers?.['retry-after'];
          const retryAfterMs = header ? Math.max(parseFloat(header) * 1000, 1000) : (1500 + Math.floor(Math.random() * 700));
          const delay = retryAfterMs + attempt * 500; // slight incremental backoff
          if (this.progressCallback) {
            this.emitProgress({ status: 'rate_limited', message: `Rate limited, waiting ${(delay/1000).toFixed(1)}s...`, count: undefined });
          }
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

  async scrapeShopifyStore(url, type = 'products', page = 1, limit = 999999, collectionHandle = null) {
    try {
      const storeUrl = this.normalizeUrl(url);
      
      if (type === 'products') {
        return await this.scrapeProducts(storeUrl, page, limit, collectionHandle);
      } else if (type === 'collections') {
        return await this.scrapeCollections(storeUrl, page, limit);
      } else {
        throw new Error('Invalid type. Use "products" or "collections"');
      }
    } catch (error) {
      console.error('Scraping error:', error);
      throw error;
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

  async scrapeProducts(storeUrl, page = 1, limit = 999999, collectionHandle = null) {
    try {
      const isStreaming = !!this.progressCallback; // In SSE mode we should finish fast and skip deep fallbacks
      const products = [];
      let totalProducts = 0;
      let hasMore = false;

      this.emitProgress({ status: 'starting', message: 'Starting to scrape store...', count: 0 });

      // Try different approaches to get products
      let productData = null;
      
      // First try: Collection-specific endpoint if collectionHandle provided
      if (collectionHandle) {
        this.emitProgress({ status: 'fetching', message: `Fetching products from collection: ${collectionHandle}...`, count: 0 });
        try {
          const response = await this.requestWithRetry(
            `${storeUrl}/collections/${collectionHandle}/products.json`,
            { headers: this.baseHeaders, timeout: 30000 },
            isStreaming ? 0 : 3,
            1000
          );
          
          if (response.data && response.data.products) {
            productData = response.data.products;
            console.log(`Found ${productData.length} products from collection ${collectionHandle}`);
            this.emitProgress({ status: 'fetching', message: `Found ${productData.length} products from collection`, count: productData.length });
          }
        } catch (error) {
          console.log(`Collection ${collectionHandle} endpoint failed:`, error.message);
        }
      }

      // Second try: Basic products endpoint
      if (!productData || productData.length === 0) {
        this.emitProgress({ status: 'fetching', message: 'Fetching products from basic endpoint...', count: 0 });
        try {
          const response = await this.requestWithRetry(
            `${storeUrl}/products.json`,
            { headers: this.baseHeaders, timeout: 30000 },
            isStreaming ? 0 : 3,
            1000
          );
          
          if (response.data && response.data.products) {
            productData = response.data.products;
            console.log(`Found ${productData.length} products via basic endpoint`);
            this.emitProgress({ status: 'fetching', message: `Found ${productData.length} products`, count: productData.length });
          }
        } catch (error) {
          console.log('Basic products endpoint failed:', error.message);
        }
      }

      // Third try: Collections/all endpoint if basic failed
      if (!productData || productData.length === 0) {
        this.emitProgress({ status: 'fetching', message: 'Trying collections/all endpoint...', count: 0 });
        try {
          const response = await this.requestWithRetry(
            `${storeUrl}/collections/all/products.json`,
            { headers: this.baseHeaders, timeout: 30000 },
            isStreaming ? 0 : 3,
            1000
          );
          
          if (response.data && response.data.products) {
            productData = response.data.products;
            console.log(`Found ${productData.length} products via collections/all endpoint`);
            this.emitProgress({ status: 'fetching', message: `Found ${productData.length} products`, count: productData.length });
          }
        } catch (error) {
          console.log('Collections/all endpoint failed:', error.message);
        }
      }

      // Get total count first to determine pagination
      totalProducts = productData ? productData.length : 0;
      let currentPage = 2;
      const maxPages = 1000; // Allow up to 1000 pages to get ALL products
      
      // Use a Set to track unique product IDs to avoid duplicates
      const uniqueProductIds = new Set();
      const uniqueProducts = [];
      
      // Add initial products to unique set
      if (productData) {
        const newProcessedBatch = [];
        productData.forEach(product => {
          if (product.id && !uniqueProductIds.has(product.id)) {
            uniqueProductIds.add(product.id);
            uniqueProducts.push(product);
            // Prepare processed minimal product for live streaming
            newProcessedBatch.push(this.mapProductForStream(product, storeUrl));
          }
        });
        productData = uniqueProducts;
        if (newProcessedBatch.length > 0) {
          this.emitProgress({ status: 'batch', message: 'Loaded initial products', count: uniqueProducts.length, products: newProcessedBatch });
        }
      }

      // Ensure we don't miss the full first page (250) — explicitly fetch page=1 with limit=250
      try {
        const firstPageUrls = [];
        if (collectionHandle) {
          firstPageUrls.push(`${storeUrl}/collections/${collectionHandle}/products.json?limit=250&page=1`);
        }
        firstPageUrls.push(`${storeUrl}/products.json?limit=250&page=1`);
        firstPageUrls.push(`${storeUrl}/collections/all/products.json?limit=250&page=1`);

        for (const firstUrl of firstPageUrls) {
          try {
            const resp = await this.requestWithRetry(firstUrl, { headers: this.baseHeaders, timeout: 30000 });
            if (resp.data && resp.data.products && resp.data.products.length > 0) {
              let added = 0;
              const batch = [];
              resp.data.products.forEach(p => {
                if (p.id && !uniqueProductIds.has(p.id)) {
                  uniqueProductIds.add(p.id);
                  uniqueProducts.push(p);
                  added++;
                  batch.push(this.mapProductForStream(p, storeUrl));
                }
              });
              if (added > 0) {
                productData = uniqueProducts;
                totalProducts = productData.length;
                this.emitProgress({ status: 'batch', message: 'Added first page (250) results', count: totalProducts, products: batch });
              }
            }
          } catch (_) {}
        }
      } catch (_) {}
      
      // Continue paginating to get ALL products
      let consecutiveEmptyPages = 0;
      let paginationBlocked = false; // set true only if all URL variants fail with 400 for a page
      let earlyNoResultsStop = false; // stop quickly when first few pages have no products
      let noResultPagesCount = 0; // count only while totalProducts === 0
      this.emitProgress({ status: 'paginating', message: 'Fetching additional pages...', count: totalProducts });
      
      while (currentPage <= maxPages && consecutiveEmptyPages < 3) { // allow a few empty pages
        try {
          // Some shops return 400 beyond ~100 pages for limit=250. Try multiple variants.
          const urlVariants = [
            `${storeUrl}/products.json?limit=250&page=${currentPage}`,
            `${storeUrl}/products.json?page=${currentPage}`,
            `${storeUrl}/products.json?limit=100&page=${currentPage}`,
            `${storeUrl}/products.json?limit=50&page=${currentPage}`
          ];
          let pageResp = null;
          let hard400 = true;
          for (const u of urlVariants) {
            try {
              const resp = await this.requestWithRetry(u, { headers: this.baseHeaders, timeout: 30000 }, 1, 800);
              if (resp?.data?.products !== undefined) {
                pageResp = resp;
                hard400 = false;
                break;
              }
            } catch (e) {
              if (e.response?.status !== 400) {
                // not a 400 cap, rethrow to outer catch
                throw e;
              }
              // continue trying next variant
            }
          }

          if (hard400 && !pageResp) {
            paginationBlocked = true;
            console.log(`Page ${currentPage} returned 400 for all variants.`);
            break; // exit pagination; will extend via sitemap below
          }

          const response = pageResp;
          if (response && response.data && response.data.products && response.data.products.length > 0) {
            // Add only unique products
            let newProductsCount = 0;
            const newProcessedBatch = [];
            response.data.products.forEach(product => {
              if (product.id && !uniqueProductIds.has(product.id)) {
                uniqueProductIds.add(product.id);
                uniqueProducts.push(product);
                newProductsCount++;
                newProcessedBatch.push(this.mapProductForStream(product, storeUrl));
              }
            });
            
            productData = uniqueProducts;
            totalProducts = productData.length;
            if (newProductsCount > 0) {
              console.log(`Added page ${currentPage}, ${newProductsCount} new products, total unique: ${totalProducts}`);
              if (newProcessedBatch.length > 0) {
                this.emitProgress({ status: 'batch', message: `Scraped page ${currentPage}`, count: totalProducts, products: newProcessedBatch });
              } else {
                this.emitProgress({ status: 'paginating', message: `Scraped page ${currentPage}`, count: totalProducts });
              }
              consecutiveEmptyPages = 0; // Reset counter when we actually gained items
              noResultPagesCount = 0; // found items
            } else {
              // Page responded but gave only duplicates; treat as empty for stop logic
              consecutiveEmptyPages++;
              console.log(`Page ${currentPage} returned only duplicates. Empty pages: ${consecutiveEmptyPages}`);
            }
          } else {
            consecutiveEmptyPages++;
            console.log(`Page ${currentPage} returned no products. Empty pages: ${consecutiveEmptyPages}`);
            if (totalProducts === 0) {
              noResultPagesCount++;
              if (noResultPagesCount >= 3) {
                earlyNoResultsStop = true;
                console.log('Early stop: first 3 pages returned no products.');
                break;
              }
            }
          }
        } catch (error) {
          consecutiveEmptyPages++;
          if (error.response?.status === 400) {
            // We'll treat as soft cap (will be verified via variants next loop)
            console.log(`Page ${currentPage} 400 on primary request.`);
          } else {
          console.log(`Page ${currentPage} failed:`, error.message);
          }
          if (totalProducts === 0) {
            noResultPagesCount++;
            if (noResultPagesCount >= 3) {
              earlyNoResultsStop = true;
              console.log('Early stop: first 3 pages failed/empty.');
              break;
            }
          }
        }
        
        currentPage++;
        
        // Add a delay to avoid overwhelming the server (Shopify storefront rate limits)
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Extended fetch: only if pagination was blocked by 400, NOT when we naturally ran out of products
      if (isStreaming) {
        const shouldExtend = !earlyNoResultsStop && paginationBlocked && (productData && productData.length > 0);
        if (shouldExtend) {
          console.log('Pagination limit reached. Extending via sitemap/product.js...');
          try {
            this.emitProgress({ status: 'fetching', message: 'Gathering remaining items...', count: totalProducts });
            const handlesFromSitemap = await this.getSitemapProductHandles(storeUrl);
            console.log(`Sitemap discovered ${handlesFromSitemap.length} product handles`);
            if (handlesFromSitemap.length > 0) {
              const existingSet = new Set((productData || []).map(p => p.id || p.handle));
              const fetchedProducts = await this.fetchProductsViaSitemapJS(storeUrl, handlesFromSitemap, existingSet, 2, 120);
              if (fetchedProducts.length > 0) {
                productData = [ ...(productData || []), ...fetchedProducts ];
                totalProducts = productData.length;
                console.log(`Extended fetch added ${fetchedProducts.length} items. Total now ${totalProducts}`);
                // Stream in small batches
                const batchSize = 50;
                for (let i = 0; i < fetchedProducts.length; i += batchSize) {
                  const slice = fetchedProducts.slice(i, i + batchSize).map(p => this.mapProductForStream(p, storeUrl));
                  this.emitProgress({ status: 'batch', message: 'Fetched more items', count: (productData || []).length, products: slice });
                  await new Promise(r => setTimeout(r, 20));
                }
              }
            }
            // Note: skipping per-collection sweep in streaming mode to avoid long tail and DNS issues.
          } catch (e) {
            console.log('Streaming extended fetch failed:', e.message);
          }
        }
        if (consecutiveEmptyPages >= 3 || paginationBlocked) {
          this.emitProgress({ status: 'processing', message: 'No more products found. Finalizing...', count: totalProducts });
        }
      } else {
      // Deep fallback: If pagination produced suspiciously low results compared to sitemap, or no results,
      // use sitemap + per-product .js to fetch ALL items reliably (bypasses storefront pagination limits)
      try {
        const handlesFromSitemap = await this.getSitemapProductHandles(storeUrl);
        if (handlesFromSitemap.length > 0) {
          // If we already have products, check if we are missing many compared to sitemap
          const existingIds = new Set((productData || []).map(p => p.id || p.handle));
          if (!productData || productData.length < handlesFromSitemap.length) {
            // Keep simple: silently fetch the rest without changing the UI messaging
            const fetchedProducts = await this.fetchProductsViaSitemapJS(storeUrl, handlesFromSitemap, existingIds);
            productData = [ ...(productData || []), ...fetchedProducts ];
            if (fetchedProducts.length > 0) {
              // Stream in one or more batches to the UI to show live products
              const batchSize = 50;
              for (let i = 0; i < fetchedProducts.length; i += batchSize) {
                const slice = fetchedProducts.slice(i, i + batchSize).map(p => this.mapProductForStream(p, storeUrl));
                this.emitProgress({ status: 'batch', message: 'Fetching products', count: (productData || []).length, products: slice });
                await new Promise(r => setTimeout(r, 20));
              }
            }
          }
        }

        // Also crawl collections from sitemap and pull products.json per collection to catch hidden/archived items
        const collectionEntries = await this.getSitemapCollections(storeUrl);
        if (collectionEntries.length > 0) {
          const seen = new Set((productData || []).map(p => p.id));
          const fromCollections = await this.fetchProductsViaCollections(storeUrl, collectionEntries.map(c => c.handle), seen);
          if (fromCollections.length > 0) {
            productData = [ ...(productData || []), ...fromCollections ];
            // Stream in batches
            const batchSize = 50;
            for (let i = 0; i < fromCollections.length; i += batchSize) {
              const slice = fromCollections.slice(i, i + batchSize).map(p => this.mapProductForStream(p, storeUrl));
              this.emitProgress({ status: 'batch', message: 'Fetching collection products', count: (productData || []).length, products: slice });
              await new Promise(r => setTimeout(r, 20));
            }
          }
        }
      } catch (e) {
        console.log('Sitemap-based fetch failed:', e.message);
        }
      }

      // Fallback: scrape from HTML pages
      if (!productData || productData.length === 0) {
        productData = await this.scrapeProductsFromHTML(storeUrl, page, limit);
      }

      // Apply pagination to the scraped data
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = productData.slice(startIndex, endIndex);

      // Process products with pagination
      this.emitProgress({ status: 'processing', message: 'Processing products...', count: totalProducts });
      
      paginatedData.forEach((product, index) => {

        const processedProduct = {
          id: product.id || `product-${startIndex + index}`,
          title: product.title || 'Untitled Product',
          handle: product.handle || this.generateHandle(product.title),
          vendor: product.vendor || 'Unknown',
          product_type: product.product_type || '',
          sku: this.extractSku(product.variants),
          price: this.extractPrice(product.variants),
          compare_at_price: this.extractComparePrice(product.variants),
          currency: 'USD',
          images: this.extractImages(product.images),
          description: product.body_html || '',
          tags: product.tags || [],
          created_at: product.created_at || '',
          updated_at: product.updated_at || '',
          published_at: product.published_at || new Date().toISOString(),
          available: this.checkAvailability(product.variants),
          url: `${storeUrl}/products/${product.handle || product.id}`,
          variants: this.processVariants(product.variants, product.title, product.handle)
        };

        products.push(processedProduct);
      });

      const totalScrapedProducts = productData.length;
      hasMore = endIndex < totalScrapedProducts;
      
      this.emitProgress({ status: 'complete', message: `Scraping completed. Total products: ${totalScrapedProducts}`, count: totalScrapedProducts });

      return {
        products,
        total: totalScrapedProducts,
        hasMore,
        store: storeUrl,
        totalPages: Math.ceil(totalScrapedProducts / limit),
        currentPage: page,
        itemsPerPage: limit
      };
    } catch (error) {
      console.error('Error scraping products:', error);
      throw new Error(`Failed to scrape products: ${error.message}`);
    }
  }

  mapProductForStream(product, storeUrl) {
    return {
      id: product.id || product.handle || '',
      title: product.title || 'Untitled Product',
      handle: product.handle || this.generateHandle(product.title),
      vendor: product.vendor || 'Unknown',
      product_type: product.product_type || product.type || '',
      sku: this.extractSku(product.variants),
      price: this.extractPrice(product.variants),
      compare_at_price: this.extractComparePrice(product.variants),
      currency: 'USD',
      images: this.extractImages(product.images),
      description: product.body_html || product.description || '',
      tags: product.tags || [],
      published_at: product.published_at || new Date().toISOString(),
      available: this.checkAvailability(product.variants),
      url: `${storeUrl}/products/${product.handle || product.id}`,
      variants: this.processVariants(product.variants, product.title, product.handle)
    };
  }

  async scrapeCollections(storeUrl, page = 1, limit = 999999) {
    try {
      const collections = [];
      
      // Try collections API endpoint
      const collectionsEndpoint = `${storeUrl}/collections.json?limit=250&page=${page}`;
      
      try {
        const response = await this.requestWithRetry(collectionsEndpoint, { headers: this.baseHeaders, timeout: 30000 }, 3, 2000);

        if (response.data && response.data.collections) {
          response.data.collections.forEach((collection, index) => {
            const processedCollection = {
              id: collection.id || `collection-${index}`,
              title: collection.title || 'Untitled Collection',
              handle: collection.handle || '',
              description: collection.body_html ? this.stripHtml(collection.body_html) : '',
              image: collection.image ? collection.image.src : null,
              products_count: collection.products_count || 0,
              published_at: collection.published_at || '',
              updated_at: collection.updated_at || '',
              url: `${storeUrl}/collections/${collection.handle || collection.id}`
            };

            collections.push(processedCollection);
          });

          return {
            collections,
            total: collections.length,
            hasMore: collections.length === limit,
            store: storeUrl
          };
        }
      } catch (error) {
        // Silently try fallbacks
      }

      // Try sitemap collections as fallback
      try {
        const sitemapCollections = await this.getSitemapCollections(storeUrl);
        if (sitemapCollections.length > 0) {
          sitemapCollections.forEach((c, index) => {
            collections.push({
              id: c.handle || `sitemap-collection-${index}`,
              title: c.title || c.handle || 'Collection',
              handle: c.handle,
              description: '',
              image: null,
              products_count: 0,
              url: `${storeUrl}/collections/${c.handle}`
            });
          });
          return { collections, total: collections.length, hasMore: false, store: storeUrl };
        }
      } catch (e) {
        // Silently fail
      }

      // Fallback: scrape from HTML
      return await this.scrapeCollectionsFromHTML(storeUrl, page, limit);
    } catch (error) {
      // Return empty collections instead of throwing error
      return { collections: [], total: 0, hasMore: false, store: storeUrl };
    }
  }

  async scrapeProductsFromHTML(storeUrl, page = 1, limit = 999999) {
    try {
      const products = [];
      const collections = ['all', 'featured', 'new-arrivals'];
      
      for (const collection of collections) {
        if (products.length >= limit) break;
        
        try {
          const response = await this.requestWithRetry(`${storeUrl}/collections/${collection}`, {
            headers: this.baseHeaders,
            timeout: 30000
          });

          const $ = cheerio.load(response.data);
          
        $('.product-item, .product-card, .grid-product__content').each((index, element) => {

            const $el = $(element);
            const product = {
              id: `html-${products.length}`,
              title: $el.find('.product-title, .product-card__title, .grid-product__title').text().trim() || 'Untitled Product',
              handle: $el.find('a').attr('href')?.split('/').pop() || '',
              vendor: $el.find('.product-vendor, .vendor').text().trim() || 'Unknown',
              price: $el.find('.price, .product-price').text().trim() || '0',
              image: $el.find('img').first().attr('src') || '',
              url: $el.find('a').attr('href') ? `${storeUrl}${$el.find('a').attr('href')}` : ''
            };

            products.push(product);
          });
        } catch (error) {
          // Silently skip failed collections
        }
      }

      return products;
    } catch (error) {
      console.error('HTML scraping error:', error);
      return [];
    }
  }

  // --- Sitemap helpers ---
  async getSitemapIndex(storeUrl) {
    try {
      // Try robots.txt first for sitemap hints
      try {
        const robots = await this.requestWithRetry(`${storeUrl}/robots.txt`, { headers: this.baseHeaders, timeout: 10000 }, 1, 500);
        const lines = String(robots.data || '').split('\n');
        const sitemapUrls = lines
          .map(l => l.trim())
          .filter(l => /^sitemap:/i.test(l))
          .map(l => l.split(':')[1]?.trim())
          .filter(Boolean);
        if (sitemapUrls.length > 0) {
          const locs = [];
          for (const sm of sitemapUrls) {
            try {
              const resp = await this.requestWithRetry(sm, { headers: this.baseHeaders, timeout: 15000 }, 1, 500);
              const $ = cheerio.load(resp.data, { xmlMode: true });
              $('sitemap > loc').each((_, el) => locs.push($(el).text()));
            } catch (_) {}
          }
          if (locs.length > 0) return locs;
        }
      } catch (_) {}

      const resp = await this.requestWithRetry(`${storeUrl}/sitemap.xml`, { headers: this.baseHeaders, timeout: 30000 }, 1, 500);
      const $ = cheerio.load(resp.data, { xmlMode: true });
      const locs = [];
      $('sitemap > loc').each((_, el) => locs.push($(el).text()));
      return locs;
    } catch (e) {
      return [];
    }
  }

  async getSitemapProductHandles(storeUrl) {
    try {
      const indexLocs = await this.getSitemapIndex(storeUrl);
      const productSitemaps = indexLocs.filter(u => /sitemap_products_\d+\.xml/.test(u));
      const handles = new Set();
      const targets = productSitemaps.length > 0 ? productSitemaps : [`${storeUrl}/sitemap_products_1.xml`];
      for (const url of targets) {
        try {
          const resp = await this.requestWithRetry(url, { headers: this.baseHeaders, timeout: 30000 });
          const $ = cheerio.load(resp.data, { xmlMode: true });
          $('url > loc').each((_, el) => {
            const loc = $(el).text();
            const parts = loc.split('/products/');
            if (parts.length > 1) {
              const handle = parts[1].replace(/\/$/, '').split('?')[0];
              if (handle) handles.add(handle);
            }
          });
        } catch (e) {
          // continue
        }
      }
      return Array.from(handles);
    } catch (_) {
      return [];
    }
  }

  async fetchProductsViaSitemapJS(storeUrl, handles, existingIdsOrHandles, concurrency = 5, perRequestDelayMs = 50) {
    const results = [];
    concurrency = Math.max(1, Math.min(concurrency, 8));
    let index = 0;
    const total = handles.length;

    const worker = async () => {
      while (true) {
        let i;
        if (index >= total) return;
        i = index++;
        const handle = handles[i];
        try {
          // Skip if already present
          if (existingIdsOrHandles && (existingIdsOrHandles.has(handle))) continue;
          const resp = await this.requestWithRetry(`${storeUrl}/products/${handle}.js`, { headers: this.baseHeaders, timeout: 30000 });
          if (resp.data) {
            const p = resp.data;
            // Adapt .js format to products.json-like
            results.push({
              id: p.id,
              title: p.title,
              handle: p.handle,
              vendor: p.vendor,
              product_type: p.type,
              variants: (p.variants || []).map(v => ({
                id: v.id,
                title: v.title,
                option1: v.option1,
                option2: v.option2,
                option3: v.option3,
                price: String(v.price / 100),
                compare_at_price: v.compare_at_price ? String(v.compare_at_price / 100) : '',
                sku: v.sku,
                barcode: v.barcode,
                available: v.available,
                inventory_quantity: v.inventory_quantity,
                weight: v.grams,
                weight_unit: 'g',
                requires_shipping: true,
                taxable: true,
                image: v.featured_image ? v.featured_image.src : ''
              })),
              images: (p.images || []).map(src => ({ src, alt: '' })),
              body_html: p.description,
              tags: (p.tags || '').split(',').map(t => t.trim()).filter(Boolean),
              created_at: '',
              updated_at: '',
              published_at: '',
            });
          }
        } catch (e) {
          // ignore per-item errors
        }
        await new Promise(r => setTimeout(r, perRequestDelayMs));
        if (i % 10 === 0 && this.progressCallback) {
          this.emitProgress({ status: 'fetching', message: `Fetched ${i + 1} of ${total}`, count: undefined });
        }
      }
    };

    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workers);
    return results;
  }

  async getSitemapCollections(storeUrl) {
    try {
      const indexLocs = await this.getSitemapIndex(storeUrl);
      const collectionSitemaps = indexLocs.filter(u => /sitemap_collections_\d+\.xml/.test(u));
      const results = [];
      const targets = collectionSitemaps.length > 0 ? collectionSitemaps : [`${storeUrl}/sitemap_collections_1.xml`];
      for (const url of targets) {
        try {
          const resp = await this.requestWithRetry(url, { headers: this.baseHeaders, timeout: 30000 });
          const $ = cheerio.load(resp.data, { xmlMode: true });
          $('url > loc').each((_, el) => {
            const loc = $(el).text();
            const parts = loc.split('/collections/');
            if (parts.length > 1) {
              const handle = parts[1].replace(/\/$/, '').split('?')[0];
              results.push({ handle, title: handle });
            }
          });
        } catch (e) {
          // continue
        }
      }
      return results;
    } catch (_) {
      return [];
    }
  }

  async fetchProductsViaCollections(storeUrl, handles, seenIds) {
    const results = [];
    const concurrency = 4;
    let idx = 0;
    const total = handles.length;

    const worker = async () => {
      while (true) {
        if (idx >= total) return;
        const i = idx++;
        const handle = handles[i];
        try {
          const resp = await this.requestWithRetry(`${storeUrl}/collections/${handle}/products.json?limit=250`, { headers: this.baseHeaders, timeout: 30000 });
          const arr = (resp.data && resp.data.products) ? resp.data.products : [];
          arr.forEach(p => {
            if (!p) return;
            if (p.id && seenIds && seenIds.has(p.id)) return;
            results.push(p);
            if (p.id && seenIds) seenIds.add(p.id);
          });
        } catch (_) {}
      }
    };

    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workers);
    return results;
  }

  async scrapeCollectionsFromHTML(storeUrl, page = 1, limit = 999999) {
    try {
      const collections = [];
      
      try {
        const response = await this.requestWithRetry(`${storeUrl}/collections`, { headers: this.baseHeaders, timeout: 10000 }, 2, 3000);

        const $ = cheerio.load(response.data);
        
        $('.collection-item, .collection-card, .grid-item').each((index, element) => {

          const $el = $(element);
          const collection = {
            id: `html-collection-${collections.length}`,
            title: $el.find('.collection-title, .collection-card__title, .grid-item__title').text().trim() || 'Untitled Collection',
            handle: $el.find('a').attr('href')?.split('/').pop() || '',
            description: $el.find('.collection-description').text().trim() || '',
            image: $el.find('img').first().attr('src') || '',
            products_count: 0,
            url: $el.find('a').attr('href') ? `${storeUrl}${$el.find('a').attr('href')}` : ''
          };

          collections.push(collection);
        });
      } catch (error) {
        console.log('Collections HTML scraping failed:', error.message);
      }

      return {
        collections,
        total: collections.length,
        hasMore: false,
        store: storeUrl
      };
    } catch (error) {
      console.error('Collections HTML scraping error:', error);
      return { collections: [], total: 0, hasMore: false, store: storeUrl };
    }
  }

  extractPrice(variants) {
    if (!variants || variants.length === 0) return '0';
    const firstVariant = variants[0];
    return firstVariant.price || '0';
  }

  extractSku(variants) {
    if (!variants || variants.length === 0) return '';
    const withSku = variants.find(v => v && v.sku) || variants[0];
    return withSku.sku || '';
  }

  extractComparePrice(variants) {
    if (!variants || variants.length === 0) return null;
    const firstVariant = variants[0];
    return firstVariant.compare_at_price || null;
  }

  extractImages(images) {
    if (!images || images.length === 0) return [];
    return images.map(img => ({
      src: img.src || img,
      alt: img.alt || ''
    }));
  }

  stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  }

  checkAvailability(variants) {
    if (!variants || variants.length === 0) return false;
    return variants.some(variant => variant.available);
  }

  generateHandle(title) {
    if (!title) return '';
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  processVariants(variants, productTitle, productHandle) {
    if (!variants || variants.length === 0) {
      // Return empty array if no variants - don't create fake ones
      return [];
    }

    return variants.map((variant, index) => ({
      id: variant.id || `${productHandle || productTitle}-variant-${index}`,
      title: variant.title || variant.option1 || `Variant ${index + 1}`,
      option1: variant.option1 || variant.title,
      option1_name: variant.option1_name || 'Size',
      option2: variant.option2 || '',
      option2_name: variant.option2_name || '',
      option3: variant.option3 || '',
      option3_name: variant.option3_name || '',
      price: variant.price || '0',
      compare_at_price: variant.compare_at_price || '',
      sku: variant.sku || '',
      barcode: variant.barcode || '',
      available: variant.available !== false,
      inventory_quantity: variant.inventory_quantity || 0,
      inventory_management: variant.inventory_management || '',
      inventory_policy: variant.inventory_policy || 'deny',
      weight: variant.weight || 0,
      weight_unit: variant.weight_unit || 'kg',
      requires_shipping: variant.requires_shipping !== false,
      taxable: variant.taxable !== false,
      image: variant.image || null
    }));
  }
}

// Create singleton instance
const scraper = new ShopifyScraper();

// Export the main scraping function
module.exports = {
  scrapeShopifyStore: (url, type, page, limit, collectionHandle) => scraper.scrapeShopifyStore(url, type, page, limit, collectionHandle),
  ShopifyScraper
};
