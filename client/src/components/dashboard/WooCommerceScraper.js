import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../utils/apiClient';
import { Search, Download, Filter, AlertCircle, CheckCircle, Loader, Eye } from 'lucide-react';
import './Scraper.css';

const WooCommerceScraper = () => {
  const { profile, user } = useAuth();
  
  const [storeUrl, setStoreUrl] = useState('');
  const [scraping, setScraping] = useState(false);
  const [progress, setProgress] = useState('');
  const [progressPercent, setProgressPercent] = useState(null); // null => indeterminate
  const [scrapedCount, setScrapedCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [eventSource, setEventSource] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [scrapingSuccessful, setScrapingSuccessful] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    vendor: '',
    tags: '',
    minPrice: '',
    maxPrice: '',
    productType: '',
    collection: '',
  });

  // Export format
  const [exportFormat, setExportFormat] = useState('woocommerce'); // 'shopify', 'woocommerce', 'json'

  useEffect(() => {
    fetchCollections();
    
    // Cleanup EventSource on unmount
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, filters, searchQuery]);

  const fetchCollections = async () => {
    if (!storeUrl) return;
    
    try {
      const url = storeUrl;
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      
      // For WooCommerce, we'll fetch categories instead of collections
      const response = await apiClient.get(`/api/scraper/woocommerce-categories/${domain}`);
      const payload = response?.data;
      const list = payload?.data?.categories || payload?.categories || payload?.data || [];
      if (Array.isArray(list)) {
        // Normalize: ensure {id,title,handle}
        const normalized = list.map((c, idx) => ({
          id: c.id || c.slug || `cat-${idx}`,
          title: c.name || c.title || `Category ${idx + 1}`,
          handle: c.slug || (c.url ? c.url.split('/').pop() : ''),
        }));
        setCollections(normalized);
      } else {
        setCollections([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCollections([]);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search by title or SKU
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        const titleMatch = p.title?.toLowerCase().includes(query) || p.name?.toLowerCase().includes(query);
        const skuMatch = p.sku?.toLowerCase().includes(query) || 
          p.variants?.some(variant => 
            variant.sku?.toLowerCase().includes(query)
          );
        return titleMatch || skuMatch;
      });
    }

    if (filters.vendor) {
      filtered = filtered.filter(p => 
        p.vendor?.toLowerCase().includes(filters.vendor.toLowerCase())
      );
    }

    if (filters.tags) {
      filtered = filtered.filter(p => 
        p.tags?.some(tag => 
          tag.toLowerCase().includes(filters.tags.toLowerCase())
        )
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(p => 
        parseFloat(p.price || 0) >= parseFloat(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(p => 
        parseFloat(p.price || 0) <= parseFloat(filters.maxPrice)
      );
    }

    if (filters.productType) {
      filtered = filtered.filter(p => 
        p.product_type?.toLowerCase().includes(filters.productType.toLowerCase()) ||
        p.type?.toLowerCase().includes(filters.productType.toLowerCase())
      );
    }

    if (filters.collection) {
      filtered = filtered.filter(p => 
        p.collections?.some(collection => 
          collection.handle === filters.collection
        ) || p.categories?.some(category => 
          category.slug === filters.collection
        )
      );
    }

    setFilteredProducts(filtered);
  };

  const handleScrape = async () => {
    if (!storeUrl) {
      setError('Please enter a store URL');
      return;
    }

    setError('');
    setSuccess('');
    setScrapingSuccessful(false);
    setScraping(true);
    setProgress('Starting...');
    setScrapedCount(0);
    setProducts([]);
    setProgressPercent(5);

    try {
      // Get authentication token from localStorage
      const sessionData = localStorage.getItem('session');
      
      if (!sessionData) {
        setError('Please sign in to use the scraper');
        setScraping(false);
        return;
      }
      
      let session = JSON.parse(sessionData);
      let accessToken = session.access_token || session.session?.access_token;
      
      if (!accessToken) {
        setError('Authentication error. Please sign in again.');
        setScraping(false);
        return;
      }

      // Create EventSource for real-time updates
      const url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/scraper/woocommerce-stream?url=${encodeURIComponent(storeUrl)}&page=1&token=${accessToken}`;
      
      const es = new EventSource(url);

      setEventSource(es);

      es.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        
        if (data.status === 'starting' || data.status === 'paginating' || data.status === 'processing') {
          // Keep progress simple and positive
          setProgress(data.message);
          setScrapedCount(data.count || 0);
          // Clear any previous errors when scraping starts successfully
          if (data.status === 'starting') {
            setError('');
          }
          // Keep progress indeterminate during scraping since we don't know total
          setProgressPercent(null);
        } else if (data.status === 'batch') {
          // Stream new products live into the table
          const newItems = data.products || [];
          setScrapedCount(data.count || (scrapedCount + newItems.length));
          setProducts(prev => {
            const merged = [...newItems.map(p => ({ ...p, id: p.id })), ...prev];
            return merged;
          });
          setProgress(`${data.message || 'Scraping...'} • Found ${data.count || scrapedCount} products`);
          // Keep progress indeterminate during batch processing
          setProgressPercent(null);
        } else if (data.status === 'complete' || data.status === 'done') {
          // Scraping complete
          setSuccess(`Found ${(data.count || data.results?.total || scrapedCount)} products! Ready to export.`);
          setScrapingSuccessful(true);
          
          es.close();
          setScraping(false);
          setProgress('');
          setProgressPercent(100);
        } else if (data.status === 'error') {
          setError(data.message);
          es.close();
          setScraping(false);
          setProgress('');
          setProgressPercent(null);
        }
      };

      es.onerror = (error) => {
        console.error('EventSource error:', error);
        
        // Check if it's an authentication error by checking the readyState
        if (error.target && error.target.readyState === EventSource.CLOSED) {
          setError('Authentication failed. Please sign in again.');
          es.close();
          setScraping(false);
          setProgress('');
          setProgressPercent(null);
          return;
        }
        
        // Only show error if we haven't successfully scraped any products
        if (products.length === 0 && !scrapingSuccessful) {
          setError('Connection error. Please check your store URL and try again.');
          es.close();
          setScraping(false);
          setProgress('');
          setProgressPercent(null);
        } else {
          // If we have products, just close the connection silently
          es.close();
          setScraping(false);
          setProgress('');
          setProgressPercent(null);
        }
      };

    } catch (error) {
      console.error('Scraping error:', error);
      setError(error.message || 'An error occurred during scraping');
      setScraping(false);
      setProgress('');
      setProgressPercent(null);
    }
  };

  const handleStopScraping = () => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
    setScraping(false);
    setProgress('');
    setProgressPercent(null);
  };

  // Helper function to generate all combinations from attribute values
  const generateCombinations = (arrays) => {
    if (arrays.length === 0) return [[]];
    if (arrays.length === 1) return arrays[0].map(item => [item]);
    
    const result = [];
    const firstArray = arrays[0];
    const restCombinations = generateCombinations(arrays.slice(1));
    
    for (const item of firstArray) {
      for (const combination of restCombinations) {
        result.push([item, ...combination]);
      }
    }
    
    return result;
  };

  const exportToCSV = () => {
    // Ensure filteredProducts is an array
    if (!Array.isArray(filteredProducts) || filteredProducts.length === 0) {
      setError('No products to export');
      return;
    }

    // Limit to 50 products for free users
    const isFreeUser = !profile || profile.subscription_tier === 'free';
    let productsToExport = [...filteredProducts]; // Create a copy to ensure it's an array
    if (isFreeUser && productsToExport.length > 50) {
      productsToExport = productsToExport.slice(0, 50);
      setSuccess(`Free plan: Exported first 50 products to WooCommerce. Upgrade for unlimited exports!`);
    } else {
      setSuccess(`Exported ${productsToExport.length} products to WooCommerce!`);
    }

    const headers = [
      'ID','Type','SKU','Name','Published','Is featured?','Visibility in catalog',
      'Short description','Description','Date sale price starts','Date sale price ends',
      'Tax status','Tax class','In stock?','Stock','Low stock amount','Backorders allowed?',
      'Sold individually?','Weight (kg)','Length (cm)','Width (cm)','Height (cm)',
      'Allow customer reviews?','Purchase note','Sale price','Regular price',
      'Categories','Tags','Shipping class','Images',
      'Download limit','Download expiry days','Parent','Grouped products','Upsells','Cross-sells',
      'External URL','Button text','Position'
    ];

    const csvRows = [];
    
    const getExportBase = () => {
      try {
        const u = new URL((storeUrl || '').trim());
        return u.hostname;
      } catch (_) {
        const s = (storeUrl || '').trim().replace(/^https?:\/\//i, '');
        return s.replace(/[^a-z0-9.-]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'export';
      }
    };

    const stripHtml = (html) => {
      if (!html) return '';
      return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    };
    const toNumber = (v, d = 0) => {
      const n = parseFloat(v);
      return Number.isFinite(n) ? String(n) : String(d);
    };
    const kgFromVariant = (v) => {
      const grams = v?.grams != null && v.grams !== '' ? parseFloat(v.grams) : null;
      if (grams != null && Number.isFinite(grams)) return String(grams / 1000);
      const w = parseFloat(v?.weight || 0);
      const unit = (v?.weight_unit || '').toLowerCase();
      if (!w) return '';
      if (unit === 'kg') return String(w);
      if (unit === 'g' || unit === '') return String(w / 1000);
      if (unit === 'lb' || unit === 'lbs') return String(w * 0.453592);
      if (unit === 'oz') return String(w * 0.0283495);
      return String(w);
    };

    // Helper function to generate all combinations from attribute values
    const generateCombinations = (arrays) => {
      if (arrays.length === 0) return [[]];
      if (arrays.length === 1) return arrays[0].map(item => [item]);
      
      const result = [];
      const firstArray = arrays[0];
      const restCombinations = generateCombinations(arrays.slice(1));
      
      for (const item of firstArray) {
        for (const combination of restCombinations) {
          result.push([item, ...combination]);
        }
      }
      
      return result;
    };

    // Helper function to create variants from product attributes
    const createVariantsFromAttributes = (product) => {
      const attributes = product.attributes || {};
      const attributeKeys = Object.keys(attributes);
      
      if (attributeKeys.length === 0) return [];
      
      // Extract attribute values
      const attributeValues = attributeKeys.map(key => {
        const attr = attributes[key];
        if (Array.isArray(attr)) return attr.map(v => String(v));
        if (typeof attr === 'string') return attr.split(',').map(v => v.trim());
        if (attr && attr.options) return attr.options.map(v => String(v));
        if (attr && attr.values) return attr.values.map(v => String(v));
        return [String(attr)];
      });
      
      // Generate combinations
      const combinations = generateCombinations(attributeValues);
      
      return combinations.map((combo, index) => ({
        id: `${product.id}-${index}`,
        title: combo.join(' / '),
        option1: combo[0] || '',
        option2: combo[1] || '',
        option3: combo[2] || '',
        price: product.price || '0',
        sku: product.sku ? `${product.sku}-${index}` : '',
        available: product.available !== false,
        inventory_quantity: product.stock_quantity || null,
        image: ''
      }));
    };

    productsToExport.forEach(product => {
      const description = stripHtml(product.description || product.body_html || '');
      const productImages = product.images || [];
      const imageUrls = productImages.map(img => (img.src || img)).join(',');
      let variants = Array.isArray(product.variants) ? product.variants : [];

      // If no variants exist but product has attributes, create variants from attributes
      if (variants.length === 0) {
        const attributeVariants = createVariantsFromAttributes(product);
        if (attributeVariants.length > 0) {
          variants = attributeVariants;
        }
      }

      // Check if product has real variants (not just default)
      const hasRealVariants = variants.length > 1 || 
        (variants.length === 1 && variants[0].title !== 'Default Title' && 
         (variants[0].option1 || variants[0].option2 || variants[0].option3 || 
          variants[0].size || variants[0].color || variants[0].style));

      // Debug logging
      console.log(`Product: ${product.title || product.name}`);
      console.log(`Variants: ${variants.length}`);
      console.log(`Has real variants: ${hasRealVariants}`);
      if (variants.length > 0) {
        console.log(`First variant:`, variants[0]);
      }

      if (hasRealVariants) {
        // Create parent variable product
        const parentSku = product.sku || product.handle || product.id || '';
        const parentRow = [
          product.id || '',
          'variable',
          parentSku,
          product.title || product.name || '',
          '1',
          '0',
          'visible',
          '',
          description,
          '',
          '',
          'taxable',
          '',
          '1',
          '',
          '',
          '0',
          '0',
          '',
          '',
          '',
          '',
          '1',
          '',
          '',
          '',
          product.product_type || product.type || '',
          Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
          '',
          imageUrls,
          '', '', '', '', '', '', '', '',
          '0'
        ];
        csvRows.push(parentRow);

        // Create variation rows
        variants.forEach((variant, idx) => {
          const regular = toNumber(variant.price || product.price || '0');
          const compare = variant.compare_at_price && parseFloat(variant.compare_at_price) < parseFloat(regular) ? String(variant.compare_at_price) : '';
          const variantImage = (variant.image && (variant.image.src || variant.image)) || '';
          const variantSku = variant.sku || `${parentSku}-${idx + 1}`;
          
          const variationRow = [
            '', // ID - empty for variations
            'variation',
            variantSku,
            '', // Name - empty for variations
            '1',
            '0',
            'visible',
            '',
            '',
            '',
            '',
            'taxable',
            '',
            variant.available === false ? '0' : '1',
            variant.inventory_quantity != null ? String(variant.inventory_quantity) : '',
            '',
            '0',
            '0',
            kgFromVariant(variant),
            '',
            '',
            '',
            '1',
            '',
            compare,
            regular,
            '', // Categories - empty for variations
            '', // Tags - empty for variations
            '',
            variantImage,
            '', '', parentSku, '', '', '', '', '', // Parent SKU in correct position
            String(idx + 1) // Position
          ];
          csvRows.push(variationRow);
        });
      } else {
        // Simple product - single row
        const variant = variants[0] || {};
        const regular = toNumber(variant.price || product.price || '0');
        const compare = variant.compare_at_price && parseFloat(variant.compare_at_price) < parseFloat(regular) ? String(variant.compare_at_price) : '';
        
        const simpleRow = [
          product.id || '',
          'simple',
          variant.sku || product.sku || '',
          product.title || product.name || '',
          '1',
          '0',
          'visible',
          '',
          description,
          '',
          '',
          'taxable',
          '',
          variant.available === false ? '0' : '1',
          variant.inventory_quantity != null ? String(variant.inventory_quantity) : '',
          '',
          '0',
          '0',
          kgFromVariant(variant),
          '',
          '',
          '',
          '1',
          '',
          compare,
          regular,
          product.product_type || product.type || '',
          Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
          '',
          imageUrls,
          '', '', '', '', '', '', '', '',
          '0'
        ];
        csvRows.push(simpleRow);
      }
    });

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => 
        row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${getExportBase()}-woocommerce.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToShopifyCSV = (productsData = null) => {
    const dataToExport = productsData || filteredProducts;
    
    // Ensure dataToExport is an array
    if (!Array.isArray(dataToExport)) {
      setError('No products to export');
      return;
    }
    
    if (dataToExport.length === 0) {
      setError('No products to export');
      return;
    }

    // Limit to 50 products for free users
    const isFreeUser = !profile || profile.subscription_tier === 'free';
    let productsToExport = [...dataToExport]; // Create a copy to ensure it's an array
    if (isFreeUser && productsToExport.length > 50) {
      productsToExport = productsToExport.slice(0, 50);
      if (!productsData) {
        setSuccess(`Free plan: Exported first 50 products to Shopify. Upgrade for unlimited exports!`);
      }
    } else if (!productsData) {
      setSuccess(`Exported ${productsToExport.length} products to Shopify!`);
    }

    const headers = [
      'Handle','Title','Body (HTML)','Vendor','Type','Tags','Published',
      'Option1 Name','Option1 Value','Option2 Name','Option2 Value','Option3 Name','Option3 Value',
      'Variant SKU','Variant Grams','Variant Inventory Tracker','Variant Inventory Policy',
      'Variant Fulfillment Service','Variant Price','Variant Compare At Price',
      'Variant Requires Shipping','Variant Taxable','Variant Barcode',
      'Image Src','Image Position','Image Alt Text','Gift Card',
      'SEO Title','SEO Description','Google Shopping / Google Product Category',
      'Google Shopping / Gender','Google Shopping / Age Group','Google Shopping / MPN',
      'Google Shopping / AdWords Grouping','Google Shopping / AdWords Labels',
      'Google Shopping / Condition','Google Shopping / Custom Product',
      'Google Shopping / Custom Label 0','Google Shopping / Custom Label 1',
      'Google Shopping / Custom Label 2','Google Shopping / Custom Label 3',
      'Google Shopping / Custom Label 4','Variant Image','Variant Weight Unit',
      'Variant Tax Code','Cost per item','Status'
    ];

    const csvRows = [];
    
    const getExportBase = () => {
      try {
        const u = new URL((storeUrl || '').trim());
        return u.hostname;
      } catch (_) {
        const s = (storeUrl || '').trim().replace(/^https?:\/\//i, '');
        return s.replace(/[^a-z0-9.-]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'export';
      }
    };

    const toBooleanUpper = (val) => (val ? 'TRUE' : 'FALSE');
    const getFirstImage = (product) => {
      const imgs = product.images || [];
      return imgs[0] ? (imgs[0].src || imgs[0]) : '';
    };
    const toGrams = (variant) => {
      if (variant?.grams != null && variant.grams !== '') return String(Math.round(parseFloat(variant.grams) || 0));
      const weight = parseFloat(variant?.weight || 0);
      if (!weight) return '0';
      const unit = (variant?.weight_unit || '').toLowerCase();
      if (unit === 'kg') return String(Math.round(weight * 1000));
      if (unit === 'g' || unit === '') return String(Math.round(weight));
      if (unit === 'lb' || unit === 'lbs') return String(Math.round(weight * 453.592));
      if (unit === 'oz') return String(Math.round(weight * 28.3495));
      return String(Math.round(weight));
    };

    productsToExport.forEach(product => {
      // Use variants_shopify from backend if available, otherwise fallback to variants
      const variants = product.variants_shopify || product.variants || [];
      const productImages = product.images || [];

      // Log the raw product data for debugging
      console.log('Processing product:', product.title || product.name);
      console.log('Raw product data:', JSON.stringify(product, null, 2));

      // Create proper variants for WooCommerce products
      let processedVariants = [];
      
      // Check if we have existing variants
      if (variants.length > 0) {
         console.log('Product has variants:', variants);
         
         // First, let's check if we have product-level attributes to extract option names
         // In WooCommerce, attributes are defined at the product level, not variant level
         let option1_name = '';
         let option2_name = '';
         let option3_name = '';
         
         if (product.attributes && Array.isArray(product.attributes)) {
           console.log('Product attributes:', product.attributes);
           product.attributes.forEach((attr, attrIndex) => {
             const attrName = attr.name || attr.label || '';
             if (attrIndex === 0) option1_name = attrName;
             else if (attrIndex === 1) option2_name = attrName;
             else if (attrIndex === 2) option3_name = attrName;
           });
         }
         
         // Use existing variants from WooCommerce
         processedVariants = variants.map((variant, index) => {
           let option1 = '';
           let option2 = '';
           let option3 = '';
           
           // Check if attributes exist and extract them
           // WooCommerce can have attributes in different formats
           if (variant.attributes && Array.isArray(variant.attributes)) {
             console.log('Variant has attributes array:', variant.attributes);
             variant.attributes.forEach((attr, attrIndex) => {
               const attrValue = attr.option || attr.value || attr.value_text || '';
               
               if (attrIndex === 0) {
                 option1 = attrValue;
               } else if (attrIndex === 1) {
                 option2 = attrValue;
               } else if (attrIndex === 2) {
                 option3 = attrValue;
               }
             });
           } else if (variant.option1 || variant.option2 || variant.option3) {
             // Direct option properties
             option1 = String(variant.option1 || '');
             option2 = String(variant.option2 || '');
             option3 = String(variant.option3 || '');
           } else if (variant.size || variant.color) {
             // Legacy attribute format
             option1 = variant.size || '';
             option2 = variant.color || '';
           }
           
           // Debug log for each variant
           console.log(`Variant ${index}:`, {
             option1_name,
             option1,
             option2_name,
             option2,
             option3_name,
             option3
           });
           
           return {
          id: variant.id || `${product.id}-${index}`,
          title: variant.title || variant.name || 'Default Title',
             option1,
             option2,
             option3,
             option1_name,
             option2_name,
             option3_name,
          price: variant.price || product.price || '0',
          sku: variant.sku || (product.sku ? `${product.sku}-${index}` : ''),
             available: variant.stock_status === 'instock' || variant.in_stock !== false,
             inventory_quantity: variant.stock_quantity || (variant.manage_stock ? variant.stock_quantity : null),
             image: variant.image ? (variant.image.src || variant.image) : ''
           };
         });
        } else {
         // Check if product has attributes but no variants
         // This can happen in WooCommerce where attributes are defined but variants aren't created
         if (product.attributes && Array.isArray(product.attributes)) {
           console.log('Product has attributes but no variants, attempting to create variants');
           // Try to create variants from product attributes
           // This is a fallback for when WooCommerce has attributes but no variant objects
         }
       }

      // If no variants, create a single default variant for simple products
      if (processedVariants.length === 0) {
        console.log('No variants found, creating default variant');
        processedVariants = [{
          id: product.id || '',
          title: 'Default Title',
          option1: '',
          option2: '',
                option3: '',
          option1_name: '',
          option2_name: '',
                option3_name: '',
                price: product.price || '0',
          sku: product.sku || '',
          available: product.stock_status === 'instock' || product.in_stock !== false,
                inventory_quantity: product.stock_quantity || null,
                image: ''
        }];
      }

      // Determine if this product has multiple variants
      // In WooCommerce, variants are detected by checking:
      // 1. If variants array has more than 1 item
      // 2. If variants have different attribute values
      // 3. If variant has attributes with multiple options
      const hasMultipleVariants = processedVariants.length > 1;
      
      // Debug log to see what we're working with
      console.log(`Product: ${product.title || product.name}`);
      console.log(`Variants count: ${processedVariants.length}`);
      console.log('Variants data:', processedVariants);

      if (hasMultipleVariants) {
         // Get option names from first variant
         const firstVariant = processedVariants[0];
         
        // Create rows for each variant
        processedVariants.forEach((variant, index) => {
          const isFirstVariant = index === 0;
          
          csvRows.push([
            product.handle || product.slug || product.id,
            isFirstVariant ? (product.title || product.name) : '',
             isFirstVariant ? (product.description || product.short_description || '') : '',
             isFirstVariant ? (product.brand || product.manufacturer || '') : '',
             isFirstVariant ? (product.categories && product.categories.length > 0 ? product.categories[0].name : '') : '',
            isFirstVariant ? (Array.isArray(product.tags) ? product.tags.join(',') : (product.tags || '')) : '',
             isFirstVariant ? new Date().toISOString() : '',
            // Option names only on first row
             isFirstVariant && firstVariant.option1 ? (firstVariant.option1_name || '') : '',
            variant.option1 || '',
             // Option 2 name only on first row
             isFirstVariant && firstVariant.option2 ? (firstVariant.option2_name || '') : '',
            variant.option2 || '',
             // Option 3 name only on first row
             isFirstVariant && firstVariant.option3 ? (firstVariant.option3_name || '') : '',
            variant.option3 || '',
             variant.sku || product.sku || '',
            toGrams(variant),
             '',
            'deny',
            'manual',
             variant.price || product.price || '0',
             '',
             'true',
             'true',
             '',
            isFirstVariant ? getFirstImage(product) : '',
            '',
            isFirstVariant ? ((productImages[0] && productImages[0].alt) ? productImages[0].alt : '') : '',
             'FALSE',
            '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
            variant.image || '',
            '',
            '',
            '',
            'active'
          ]);
        });
      } else {
         // Single variant product - no options
        const variant = processedVariants[0];
        csvRows.push([
          product.handle || product.slug || product.id,
          product.title || product.name,
           product.description || product.short_description || '',
           product.brand || product.manufacturer || '',
           product.categories && product.categories.length > 0 ? product.categories[0].name : '',
          Array.isArray(product.tags) ? product.tags.join(',') : (product.tags || ''),
           new Date().toISOString(),
           '', // Option1 Name - empty for single variant
           '', // Option1 Value - empty for single variant
           '', // Option2 Name - empty for single variant
           '', // Option2 Value - empty for single variant
           '', // Option3 Name - empty for single variant
           '', // Option3 Value - empty for single variant
          variant.sku || product.sku || '',
          toGrams(variant),
           '',
          'deny',
          'manual',
          variant.price || product.price || '0',
           '',
           'true',
           'true',
          '',
          getFirstImage(product),
          '',
          (productImages[0] && productImages[0].alt) ? productImages[0].alt : '',
           'FALSE',
          '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
          getFirstImage(product),
          '',
          '',
          '',
          'active'
        ]);
      }
    });

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => 
        row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${getExportBase()}-shopify.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSelectedProducts = () => {
    if (selectedIds.length === 0) {
      setError('No products selected');
      return;
    }
    const source = filteredProducts.length > 0 ? filteredProducts : products;
    
    // Ensure source is an array
    if (!Array.isArray(source)) {
      setError('No products available for export');
      return;
    }
    
    let selected = source.filter(p => selectedIds.includes(p.id));
    
    // Limit to 50 products for free users
    const isFreeUser = !profile || profile.subscription_tier === 'free';
    if (isFreeUser && selected.length > 50) {
      selected = selected.slice(0, 50);
      setSuccess(`Free plan: Exported first 50 of ${selectedIds.length} selected products. Upgrade for unlimited exports!`);
    } else {
      setSuccess(`Exported ${selected.length} selected products!`);
    }
    
    exportToShopifyCSV(selected);
  };

  const exportSelectedToWooCommerce = (selectedProducts) => {
    if (selectedProducts.length === 0) {
      setError('No products to export');
      return;
    }
    
    // Limit to 50 products for free users
    const isFreeUser = !profile || profile.subscription_tier === 'free';
    let productsToExport = [...selectedProducts];
    if (isFreeUser && productsToExport.length > 50) {
      productsToExport = productsToExport.slice(0, 50);
      setSuccess(`Free plan: Exported first 50 of ${selectedProducts.length} selected products. Upgrade for unlimited exports!`);
    } else {
      setSuccess(`Exported ${productsToExport.length} selected products!`);
    }

    // Use the same export logic as exportToCSV
    // We'll create a custom export here for selected products
    exportToCSVWithProducts(productsToExport);
  };

  const exportToJSON = (productsData = null) => {
    const dataToExport = productsData || filteredProducts;
    
    if (!Array.isArray(dataToExport) || dataToExport.length === 0) {
      setError('No products to export');
      return;
    }

    // Limit to 50 products for free users
    const isFreeUser = !profile || profile.subscription_tier === 'free';
    let productsToExport = [...dataToExport];
    if (isFreeUser && productsToExport.length > 50) {
      productsToExport = productsToExport.slice(0, 50);
      setSuccess(`Free plan: Exported first 50 products. Upgrade for unlimited exports!`);
    } else {
      setSuccess(`Exported ${productsToExport.length} products!`);
    }

    const jsonContent = JSON.stringify(productsToExport, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const getExportBase = () => {
      try {
        const u = new URL((storeUrl || '').trim());
        return u.hostname;
      } catch (_) {
        const s = (storeUrl || '').trim().replace(/^https?:\/\//i, '');
        return s.replace(/[^a-z0-9.-]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'export';
      }
    };
    
    link.setAttribute('download', `${getExportBase()}-products.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToCSVWithProducts = (productsToExport) => {
    // This is a helper function to export specific products to WooCommerce format
    // We'll implement this by copying the exportToCSV logic but for specific products
    const headers = [
      'ID','Type','SKU','Name','Published','Is featured?','Visibility in catalog',
      'Short description','Description','Date sale price starts','Date sale price ends',
      'Tax status','Tax class','In stock?','Stock','Low stock amount','Backorders allowed?',
      'Sold individually?','Weight (kg)','Length (cm)','Width (cm)','Height (cm)',
      'Allow customer reviews?','Purchase note','Sale price','Regular price',
      'Categories','Tags','Shipping class','Images',
      'Download limit','Download expiry days','Parent','Grouped products','Upsells','Cross-sells',
      'External URL','Button text','Position'
    ];

    const csvRows = [];
    
    const getExportBase = () => {
      try {
        const u = new URL((storeUrl || '').trim());
        return u.hostname;
      } catch (_) {
        const s = (storeUrl || '').trim().replace(/^https?:\/\//i, '');
        return s.replace(/[^a-z0-9.-]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'export';
      }
    };

    const stripHtml = (html) => {
      if (!html) return '';
      return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    };
    const toNumber = (v, d = 0) => {
      const n = parseFloat(v);
      return Number.isFinite(n) ? String(n) : String(d);
    };
    const kgFromVariant = (v) => {
      const grams = v?.grams != null && v.grams !== '' ? parseFloat(v.grams) : null;
      if (grams != null && Number.isFinite(grams)) return String(grams / 1000);
      const w = parseFloat(v?.weight || 0);
      const unit = (v?.weight_unit || '').toLowerCase();
      if (!w) return '';
      if (unit === 'kg') return String(w);
      if (unit === 'g' || unit === '') return String(w / 1000);
      if (unit === 'lb' || unit === 'lbs') return String(w * 0.453592);
      if (unit === 'oz') return String(w * 0.0283495);
      return String(w);
    };

    productsToExport.forEach(product => {
      const description = stripHtml(product.description || product.body_html || '');
      const productImages = product.images || [];
      const imageUrls = productImages.map(img => (img.src || img)).join(',');
      let variants = Array.isArray(product.variants) ? product.variants : [];

      const hasRealVariants = variants.length > 1 || 
        (variants.length === 1 && variants[0].title !== 'Default Title' && 
         (variants[0].option1 || variants[0].option2 || variants[0].option3 || 
          variants[0].size || variants[0].color || variants[0].style));

      if (hasRealVariants) {
        // Create parent variable product
        const parentSku = product.sku || product.handle || product.id || '';
        const parentRow = [
          product.id || '',
          'variable',
          parentSku,
          product.title || product.name || '',
          '1', '0', 'visible', '', description, '', '', 'taxable', '', '1', '', '', '0', '0',
          '', '', '', '', '1', '', '', '', product.product_type || product.type || '',
          Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''), '',
          imageUrls, '', '', '', '', '', '', '', '', '0'
        ];
        csvRows.push(parentRow);

        // Create variation rows
        variants.forEach((variant, idx) => {
          const regular = toNumber(variant.price || product.price || '0');
          const compare = variant.compare_at_price && parseFloat(variant.compare_at_price) < parseFloat(regular) ? String(variant.compare_at_price) : '';
          const variantImage = (variant.image && (variant.image.src || variant.image)) || '';
          const variantSku = variant.sku || `${parentSku}-${idx + 1}`;
          
          const variationRow = [
            '', 'variation', variantSku, '', '1', '0', 'visible', '', '', '', '', 'taxable', '',
            variant.available === false ? '0' : '1', variant.inventory_quantity != null ? String(variant.inventory_quantity) : '', '',
            '0', '0', kgFromVariant(variant), '', '', '', '1', '', compare, regular, '', '', '',
            variantImage, '', '', parentSku, '', '', '', '', '', String(idx + 1)
          ];
          csvRows.push(variationRow);
        });
      } else {
        // Simple product
        const variant = variants[0] || {};
        const regular = toNumber(variant.price || product.price || '0');
        const compare = variant.compare_at_price && parseFloat(variant.compare_at_price) < parseFloat(regular) ? String(variant.compare_at_price) : '';
        
        const simpleRow = [
          product.id || '', 'simple', variant.sku || product.sku || '', product.title || product.name || '',
          '1', '0', 'visible', '', description, '', '', 'taxable', '', variant.available === false ? '0' : '1',
          variant.inventory_quantity != null ? String(variant.inventory_quantity) : '', '', '0', '0',
          kgFromVariant(variant), '', '', '', '1', '', compare, regular,
          product.product_type || product.type || '',
          Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''), '', imageUrls,
          '', '', '', '', '', '', '', '', '0'
        ];
        csvRows.push(simpleRow);
      }
    });

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => 
        row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${getExportBase()}-woocommerce.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const clearFilters = () => {
    setFilters({
      vendor: '',
      tags: '',
      minPrice: '',
      maxPrice: '',
      productType: '',
      collection: '',
    });
    setSearchQuery('');
  };

  const resetScraping = () => {
    setProducts([]);
    setFilteredProducts([]);
    setScrapedCount(0);
    setScrapingSuccessful(false);
    setSelectedIds([]);
    setError('');
    setSuccess('');
    setProgress('');
    setProgressPercent(null);
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="scraper-page">
      <div className="scraper-container">
        <div className="scraper-header">
          <h1>WooCommerce Scraper</h1>
          <p>Extract WooCommerce products and export to CSV/Excel (no data storage)</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <div className="scraper-form">
        <div className="form-group">
          <label>Store URL</label>
          <div className="input-group">
            <Search size={28} />
            <input
              type="url"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={scraping}
            />
            <button 
              className="btn-primary" 
              onClick={handleScrape}
              disabled={scraping || !storeUrl}
            >
              {scraping ? <Loader size={20} className="spinner" /> : 'Scrape'}
            </button>
          </div>
        </div>

        {scraping && (
          <div className="progress-message">
            <div className="scrape-progress">
              <div className="scrape-progress-header">
                <span>Scraping in progress...</span>
                <span>{typeof progressPercent === 'number' ? `${Math.round(progressPercent)}%` : 'Finding products...'}</span>
              </div>
              <div className={`scrape-progress-bar ${typeof progressPercent === 'number' ? '' : 'indeterminate'}`}>
                <div
                  className="scrape-progress-fill"
                  style={{ width: typeof progressPercent === 'number' ? `${Math.max(5, Math.min(100, progressPercent))}%` : '50%' }}
                />
              </div>
              {scrapedCount > 0 && (
                <div className="progress-count">
                  Total products found: <strong>{scrapedCount}</strong>
                </div>
              )}
            </div>
            <button className="btn-secondary btn-sm" onClick={handleStopScraping}>
              Stop
            </button>
          </div>
        )}
      </div>

      {products.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <div className="results-info">
              <h3>Scraped Products ({filteredProducts.length})</h3>
              <p>Found {scrapedCount} products from {storeUrl}</p>
            </div>
            
            <div className="results-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                Filters
              </button>
              
              <div className="export-buttons">
                <div className="export-controls">
                  <select 
                    value={exportFormat} 
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="format-selector"
                  >
                    <option value="woocommerce">WooCommerce</option>
                    <option value="shopify">Shopify</option>
                    <option value="json">JSON</option>
                  </select>
                  <button 
                    className="btn-primary export-btn" 
                    onClick={() => {
                      if (selectedIds.length > 0) {
                        const source = filteredProducts.length > 0 ? filteredProducts : products;
                        let selected = source.filter(p => selectedIds.includes(p.id));
                        if (exportFormat === 'shopify') {
                          exportToShopifyCSV(selected);
                        } else if (exportFormat === 'woocommerce') {
                          exportSelectedToWooCommerce(selected);
                        } else {
                          exportToJSON(selected);
                        }
                      } else {
                        if (exportFormat === 'shopify') {
                          exportToShopifyCSV(filteredProducts.length > 0 ? filteredProducts : products);
                        } else if (exportFormat === 'woocommerce') {
                          exportToCSV();
                        } else {
                          exportToJSON(filteredProducts.length > 0 ? filteredProducts : products);
                        }
                      }
                    }}
                    title={`Export products in ${exportFormat === 'woocommerce' ? 'WooCommerce' : exportFormat === 'shopify' ? 'Shopify' : 'JSON'} format`}
                  >
                    <Download size={16} />
                    Export {selectedIds.length > 0 ? `(${selectedIds.length})` : 'All'}
                </button>
                </div>
              </div>
              
              <button className="btn-secondary" onClick={resetScraping}>
                Reset
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Search</label>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="filter-group">
                  <label>Vendor</label>
                  <input
                    type="text"
                    placeholder="Filter by vendor"
                    value={filters.vendor}
                    onChange={(e) => setFilters({...filters, vendor: e.target.value})}
                  />
                </div>
                
                <div className="filter-group">
                  <label>Tags</label>
                  <input
                    type="text"
                    placeholder="Filter by tags"
                    value={filters.tags}
                    onChange={(e) => setFilters({...filters, tags: e.target.value})}
                  />
                </div>
                
                <div className="filter-group">
                  <label>Min Price</label>
                  <input
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  />
                </div>
                
                <div className="filter-group">
                  <label>Max Price</label>
                  <input
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  />
                </div>
                
                <div className="filter-group">
                  <label>Product Type</label>
                  <input
                    type="text"
                    placeholder="Filter by type"
                    value={filters.productType}
                    onChange={(e) => setFilters({...filters, productType: e.target.value})}
                  />
                </div>
                
                <div className="filter-group">
                  <label>Category</label>
                  <select
                    value={filters.collection}
                    onChange={(e) => setFilters({...filters, collection: e.target.value})}
                  >
                    <option value="">All Categories</option>
                    {collections.map(collection => (
                      <option key={collection.id} value={collection.handle}>
                        {collection.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="filters-actions">
                <button className="btn-secondary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            </div>
          )}

            <div className="products-summary">
              <p>
                Showing {startIndex + 1} - {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                {filters.vendor || filters.tags || filters.productType || filters.minPrice || filters.maxPrice || filters.collection ? ' (filtered)' : ''}
              </p>
              {totalPages > 1 && (
              <div className="pagination">
              <button 
                className="pagination-arrow"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ←
              </button>
              
              <div className="pagination-numbers">
                {(() => {
                  const pages = [];
                  const maxVisible = 7;
                  
                  if (totalPages <= maxVisible) {
                    // Show all pages
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(
                        <button
                          key={i}
                          className={`pagination-number ${currentPage === i ? 'active' : ''}`}
                          onClick={() => setCurrentPage(i)}
                        >
                          {i}
                        </button>
                      );
                    }
                  } else {
                    // Show first page
                    pages.push(
                      <button
                        key={1}
                        className={`pagination-number ${currentPage === 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(1)}
                      >
                        1
                      </button>
                    );
                    
                    // Show ellipsis or pages around current
                    if (currentPage > 3) {
                      pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
                    }
                    
                    // Show pages around current page
                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);
                    
                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <button
                          key={i}
                          className={`pagination-number ${currentPage === i ? 'active' : ''}`}
                          onClick={() => setCurrentPage(i)}
                        >
                          {i}
                        </button>
                      );
                    }
                    
                    // Show ellipsis before last page
                    if (currentPage < totalPages - 2) {
                      pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
                    }
                    
                    // Show last page
                    pages.push(
                      <button
                        key={totalPages}
                        className={`pagination-number ${currentPage === totalPages ? 'active' : ''}`}
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </button>
                    );
                  }
                  
                  return pages;
                })()}
              </div>
              
              <button 
                className="pagination-arrow"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                →
              </button>
              </div>
              )}
            </div>


          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>SKU</th>
                  <th>Vendor</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Compare Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                      />
                    </td>
                    <td>
                      {product.images && product.images[0] ? (
                        <img 
                          src={product.images[0].src || product.images[0]} 
                          alt={product.title || product.name}
                          className="product-image"
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </td>
                    <td>
                      <div className="product-title">
                        {product.title || product.name}
                      </div>
                    </td>
                    <td>{product.sku || '-'}</td>
                    <td>{product.vendor || '-'}</td>
                    <td>{product.product_type || product.type || '-'}</td>
                    <td>
                      {product.price ? `$${parseFloat(product.price).toFixed(2)}` : '-'}
                    </td>
                    <td>
                      {product.compare_at_price ? `$${parseFloat(product.compare_at_price).toFixed(2)}` : '-'}
                    </td>
                    <td>
                      <div className="row-actions">
                        <a
                          className="btn-sm btn-outline"
                          href={product.url || `${storeUrl}/product/${product.slug || product.handle || product.id}`}
                          target="_blank"
                          rel="noreferrer"
                          title="View product"
                        >
                        <Eye size={14} />
                        </a>
                        <button
                          className="btn-sm btn-outline"
                          title="Download CSV for this product"
                          onClick={() => exportToShopifyCSV([product])}
                        >
                          <Download size={14} />
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default WooCommerceScraper;