import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../utils/apiClient';
import { Search, Download, Filter, AlertCircle, CheckCircle, Loader, Eye } from 'lucide-react';
import './Scraper.css';

const Scraper = () => {
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
  const [consentChecked, setConsentChecked] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [collectionSearchQuery, setCollectionSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    vendor: '',
    tags: '',
    minPrice: '',
    maxPrice: '',
    productType: '',
    collection: [], // multiple collection handles
  });

  useEffect(() => {
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
      const url = storeUrl.trim();
      if (!url.startsWith('http')) {
        return;
      }
      
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      
      const response = await apiClient.get(`/api/scraper/collections/${encodeURIComponent(domain)}`);
      const payload = response?.data;
      const list = payload?.data?.collections || payload?.collections || payload?.data || [];
      
      if (Array.isArray(list) && list.length > 0) {
        // Normalize: ensure {id,title,handle}
        const normalized = list.map((c, idx) => ({
          id: c.id || c.handle || `col-${idx}`,
          title: c.title || c.handle || `Collection ${idx + 1}`,
          handle: c.handle || (c.url ? c.url.split('/').pop() : ''),
        }));
        setCollections(normalized);
      } else {
        setCollections([]);
      }
    } catch (error) {
      // Silently fail - collections are optional
      setCollections([]);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search by title or SKU
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        const titleMatch = p.title?.toLowerCase().includes(query);
        const skuMatch = p.variants?.some(variant => 
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
      const searchTags = filters.tags.toLowerCase().split(',').map(t => t.trim());
      filtered = filtered.filter(p => 
        p.tags && p.tags.some(tag => 
          searchTags.some(searchTag => tag.toLowerCase().includes(searchTag))
        )
      );
    }

    if (filters.productType) {
      filtered = filtered.filter(p => 
        p.product_type?.toLowerCase().includes(filters.productType.toLowerCase())
      );
    }

    if (filters.collection) {
      // Filter by collection - products should have collection info
      // For now, we'll add collection filtering when exporting
      // Since products in DB don't have collection field yet
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

    setFilteredProducts(filtered);
  };

  const handleScrape = async () => {
    if (!storeUrl) {
      setError('Please enter a store URL');
      return;
    }

    // Clear all previous data when starting a new scrape
    setProducts([]);
    setFilteredProducts([]);
    setSelectedIds([]);
    setCollections([]);
    setScrapedCount(0);
    setError('');
    setSuccess('');
    setScrapingSuccessful(false);
    setScraping(true);
    setProgress('Starting to scrape store...');
    setFilters({
      vendor: '',
      tags: '',
      minPrice: '',
      maxPrice: '',
      productType: '',
      collection: [],
    });
    setCollectionSearchQuery('');
    setProgressPercent(5);

    // Close any existing EventSource
    if (eventSource) {
      eventSource.close();
    }

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
      // Note: EventSource doesn't support custom headers, so we pass the token as a query param
      const collectionParam = (filters.collection && filters.collection.length > 0)
        ? `&collectionHandle=${encodeURIComponent(filters.collection.join(','))}`
        : '';
      const url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/scraper/scrape-stream?url=${encodeURIComponent(storeUrl)}&type=products&page=1&token=${accessToken}${collectionParam}`;
      
      console.log('Creating EventSource with URL:', url);
      console.log('Token present:', !!accessToken);
      console.log('API URL:', process.env.REACT_APP_API_URL);
      
      const es = new EventSource(url);

      setEventSource(es);

      es.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        
        if (data.status === 'starting' || data.status === 'paginating' || data.status === 'processing' || data.status === 'rate_limited' || data.status === 'fetching') {
          // Only update the total count; do not show detailed step messages
          setProgress('');
          if (typeof data.count === 'number') {
            setScrapedCount(data.count);
          }
          if (data.status === 'starting') {
            setError('');
            // Fetch collections for the new store after scraping starts successfully
            fetchCollections();
          }
          // Keep progress indeterminate during scraping since we don't know total
          setProgressPercent(null);
        } else if (data.status === 'batch') {
          // Stream new products live into the table
          const newItems = data.products || [];
          if (typeof data.count === 'number') {
            setScrapedCount(data.count);
          } else {
            setScrapedCount(prev => prev + newItems.length);
          }
          setProducts(prev => {
            const merged = [...newItems.map(p => ({ ...p, id: p.id })), ...prev];
            return merged;
          });
          // Do not show per-page or fetching messages
          setProgress('');
          // Keep progress indeterminate during batch processing
          setProgressPercent(null);
        } else if (data.status === 'complete' || data.status === 'done') {
          // Scraping complete
          setSuccess(`Scraping completed. Total products: ${(data.count || data.results?.total || scrapedCount)}`);
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

    } catch (err) {
      setError(err.message);
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

  const handleExport = () => {
    let dataToExport = filteredProducts.length > 0 ? filteredProducts : products;
    
    if (dataToExport.length === 0) {
      setError('No products to export');
      return;
    }

    // Limit to 50 products for free users
    const isFreeUser = !profile || profile.subscription_tier === 'free';
    if (isFreeUser && dataToExport.length > 50) {
      dataToExport = dataToExport.slice(0, 50);
      setSuccess(`Free plan: Exported first 50 of ${filteredProducts.length > 0 ? filteredProducts.length : products.length} products. Upgrade for unlimited exports!`);
    } else {
    setSuccess(`Exported ${dataToExport.length} products successfully!`);
    }

    exportToShopifyCSV(dataToExport);
  };

  const handleExportSelected = () => {
    if (selectedIds.length === 0) {
      setError('No products selected');
      return;
    }
    const source = filteredProducts.length > 0 ? filteredProducts : products;
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

  const toggleSelectAllCurrent = (checked) => {
    if (checked) {
      const ids = currentProducts.map(p => p.id);
      const merged = Array.from(new Set([...selectedIds, ...ids]));
      setSelectedIds(merged);
    } else {
      const currentIds = new Set(currentProducts.map(p => p.id));
      setSelectedIds(selectedIds.filter(id => !currentIds.has(id)));
    }
  };

  const toggleSelectOne = (id, checked) => {
    if (checked) setSelectedIds(prev => Array.from(new Set([...prev, id])));
    else setSelectedIds(prev => prev.filter(x => x !== id));
  };

  const exportToShopifyCSV = (productsData) => {
    const getExportBase = () => {
      try {
        const u = new URL((storeUrl || '').trim());
        return u.hostname;
      } catch (_) {
        const s = (storeUrl || '').trim().replace(/^https?:\/\//i, '');
        return s.replace(/[^a-z0-9.-]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'export';
      }
    };

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
    
    productsData.forEach(product => {
      const variants = product.variants || [];

      const toBooleanUpper = (val) => (val ? 'TRUE' : 'FALSE');
      const getFirstImage = () => {
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

      if (variants.length > 0) {
        const option1Name = (variants[0]?.option1 ? (variants[0]?.option1_name || (product.options?.[0]?.name) || 'Option 1') : '') || '';
        const option2Name = (variants[0]?.option2 ? (variants[0]?.option2_name || (product.options?.[1]?.name) || 'Option 2') : '') || '';
        const option3Name = (variants[0]?.option3 ? (variants[0]?.option3_name || (product.options?.[2]?.name) || 'Option 3') : '') || '';

        variants.forEach((variant, index) => {
          const isFirstVariant = index === 0;
          const productImages = product.images || [];
          const variantImage = variant?.image || variant?.featured_image || '';

          csvRows.push([
            product.handle || product.id,
            isFirstVariant ? product.title : '',
            isFirstVariant ? (product.description || product.body_html || '') : '',
            isFirstVariant ? (product.vendor || '') : '',
            isFirstVariant ? (product.product_type || '') : '',
            isFirstVariant ? (Array.isArray(product.tags) ? product.tags.join(',') : (product.tags || '')) : '',
            isFirstVariant ? 'TRUE' : '',
            // Option names only on first row per product
            variant.option1 ? (isFirstVariant ? option1Name : '') : '',
            variant.option1 || variant.title || '',
            variant.option2 ? (isFirstVariant ? option2Name : '') : '',
            variant.option2 || '',
            variant.option3 ? (isFirstVariant ? option3Name : '') : '',
            variant.option3 || '',
            variant.sku || '',
            toGrams(variant),
            '',
            'deny',
            'manual',
            variant.price || product.price || '0',
            variant.compare_at_price || product.compare_at_price || '',
            toBooleanUpper(true),
            toBooleanUpper(true),
            variant.barcode || '',
            isFirstVariant ? getFirstImage() : '',
            '',
            isFirstVariant ? ((productImages[0] && productImages[0].alt) ? productImages[0].alt : '') : '',
            toBooleanUpper(false),
            '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
            variantImage ? (variantImage.src || variantImage) : '',
            '',
            '',
            '',
            'active'
          ]);
        });
      } else {
        // Product with single default variant
        const productImages = product.images || [];
        csvRows.push([
          product.handle || product.id,
          product.title,
          product.description || product.body_html || '',
          product.vendor || '',
          product.product_type || '',
          Array.isArray(product.tags) ? product.tags.join(',') : (product.tags || ''),
          'TRUE',
          'Title','Default Title','', '', '', '',
          product.sku || '',
          '0',
          '',
          'deny',
          'manual',
          product.price || '0',
          product.compare_at_price || '',
          toBooleanUpper(true),
          toBooleanUpper(true),
          '',
          getFirstImage(),
          '',
          (productImages[0] && productImages[0].alt) ? productImages[0].alt : '',
          toBooleanUpper(false),
          '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
          getFirstImage(),
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

  const exportToWooCommerceCSV = (productsData, showMessage = true) => {
    // Limit to 50 products for free users
    const isFreeUser = !profile || profile.subscription_tier === 'free';
    if (isFreeUser && productsData.length > 50) {
      productsData = productsData.slice(0, 50);
      if (showMessage) {
        setSuccess(`Free plan: Exported first 50 products to WooCommerce. Upgrade for unlimited exports!`);
      }
    } else if (showMessage) {
      setSuccess(`Exported ${productsData.length} products to WooCommerce!`);
    }
    
    const headers = [
      'ID', 'Type', 'SKU', 'Name', 'Published', 'Is featured?', 'Visibility in catalog', 
      'Short description', 'Description', 'Date sale price starts', 'Date sale price ends', 
      'Tax status', 'Tax class', 'In stock?', 'Stock', 'Low stock amount', 'Backorders allowed?', 
      'Sold individually?', 'Weight (kg)', 'Length (cm)', 'Width (cm)', 'Height (cm)', 
      'Allow customer reviews?', 'Purchase note', 'Sale price', 'Regular price', 
      'Categories', 'Tags', 'Shipping class', 'Images', 
      // Attributes (up to 3)
      'Attribute 1 name','Attribute 1 value(s)','Attribute 1 visible','Attribute 1 global',
      'Attribute 2 name','Attribute 2 value(s)','Attribute 2 visible','Attribute 2 global',
      'Attribute 3 name','Attribute 3 value(s)','Attribute 3 visible','Attribute 3 global',
      'Download limit', 'Download expiry days', 'Parent', 'Grouped products', 'Upsells', 'Cross-sells', 
      'External URL', 'Button text', 'Position'
    ];

    const csvRows = [];
    
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

    productsData.forEach(product => {
      const description = stripHtml(product.description || product.body_html || '');
      const productImages = product.images || [];
      const imageUrls = productImages.map(img => (img.src || img)).join(',');
      const variants = Array.isArray(product.variants) ? product.variants : [];

      // Determine attributes from variants
      const hasRealVariants = variants.length > 1 || (variants.length === 1 && (variants[0].option1 || variants[0].option2 || variants[0].option3) && variants[0].title !== 'Default Title');
      const uniqueVals = (arr) => Array.from(new Set(arr.filter(Boolean)));
      const attr1Name = variants[0]?.option1 ? (variants[0]?.option1_name || 'Attribute 1') : '';
      const attr2Name = variants[0]?.option2 ? (variants[0]?.option2_name || 'Attribute 2') : '';
      const attr3Name = variants[0]?.option3 ? (variants[0]?.option3_name || 'Attribute 3') : '';
      const attr1Vals = uniqueVals(variants.map(v => v.option1));
      const attr2Vals = uniqueVals(variants.map(v => v.option2));
      const attr3Vals = uniqueVals(variants.map(v => v.option3));
      const attrJoin = vals => vals.join(' | ');

      const parentSku = (product.sku || product.handle || product.id || '') + '';

      if (hasRealVariants) {
        // Parent variable product row
        const parentRow = [
          product.id || '',
          'variable',
          parentSku,
          product.title || '',
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
          '',
          '',
          '',
          '',
          product.product_type || '',
          Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
          '',
          imageUrls,
          // Attributes on parent
          attr1Name, attrJoin(attr1Vals), '1', '0',
          attr2Name, attrJoin(attr2Vals), attr2Name ? '1' : '', attr2Name ? '0' : '',
          attr3Name, attrJoin(attr3Vals), attr3Name ? '1' : '', attr3Name ? '0' : '',
          '', '', '', '', '', '', '', '',
          '0'
        ];
        csvRows.push(parentRow);

        // Variation rows
        variants.forEach((v, idx) => {
          const regular = toNumber(v.price || product.price || '0');
          const compare = v.compare_at_price && parseFloat(v.compare_at_price) < parseFloat(regular) ? String(v.compare_at_price) : '';
          const vImage = (v.image && (v.image.src || v.image)) || (productImages[0] ? (productImages[0].src || productImages[0]) : '');
          const sku = v.sku || `${parentSku}-${(v.option1 || v.title || ('v' + (idx+1))).toString().toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
          const row = [
            '',
            'variation',
            sku,
            '',
            '1',
            '0',
            'visible',
            '',
            '',
            '',
            '',
            'taxable',
            '',
            v.available === false ? '0' : '1',
            v.inventory_quantity != null ? String(v.inventory_quantity) : '',
            '',
            '0',
            '0',
            kgFromVariant(v),
            '',
            '',
            '',
            '1',
            '',
            compare,
            regular,
            product.product_type || '',
            Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
            '',
            vImage,
            // Attributes on variation (must match parent names)
            attr1Name || (v.option1 ? 'Attribute 1' : ''), v.option1 || '', '', '',
            attr2Name || (v.option2 ? 'Attribute 2' : ''), v.option2 || '', '', '',
            attr3Name || (v.option3 ? 'Attribute 3' : ''), v.option3 || '', '', '',
            '', '', parentSku, '', '', '', '', '',
            String(idx)
          ];
          csvRows.push(row);
        });
      } else {
        // Simple product row
        const regular = toNumber(product.price || variants[0]?.price || '0');
        const compare = (variants[0]?.compare_at_price && parseFloat(variants[0].compare_at_price) < parseFloat(regular)) ? String(variants[0].compare_at_price) : '';
        const row = [
          product.id || '',
          'simple',
          product.sku || (variants[0]?.sku || ''),
          product.title || '',
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
          variants[0] ? kgFromVariant(variants[0]) : '',
          '',
          '',
          '',
          '1',
          '',
          compare,
          regular,
          product.product_type || '',
          Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
          '',
          imageUrls,
          // Empty attribute columns for simple product
          '', '', '', '', '', '', '', '', '', '', '',
          '', '', '', '', '', '', '', '',
          '0'
        ];
        csvRows.push(row);
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
    // Reuse the same base hostname logic
    let base;
    try {
      const u = new URL((storeUrl || '').trim());
      base = u.hostname;
    } catch (_) {
      const s = (storeUrl || '').trim().replace(/^https?:\/\//i, '');
      base = s.replace(/[^a-z0-9.-]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'export';
    }
    link.setAttribute('download', `${base}-woocommerce.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportByCollection = async (collectionHandles) => {
    if (!collectionHandles || (Array.isArray(collectionHandles) && collectionHandles.length === 0)) {
      setError('Please select a collection');
      return;
    }

    try {
      setProgress('Fetching products from selected collections...');
      const handles = Array.isArray(collectionHandles) ? collectionHandles : [collectionHandles];
      let merged = [];
      for (const handle of handles) {
      const data = await apiClient.post('/api/scraper/collection-products', {
        url: storeUrl,
          collectionHandle: handle,
        });
        if (Array.isArray(data.data?.data?.products)) {
          merged = merged.concat(data.data.data.products);
        } else if (Array.isArray(data.data?.products)) {
          merged = merged.concat(data.data.products);
        }
      }
      
      // Limit to 50 products for free users
      const isFreeUser = !profile || profile.subscription_tier === 'free';
      if (isFreeUser && merged.length > 50) {
        merged = merged.slice(0, 50);
        setSuccess(`Free plan: Exported first 50 of ${merged.length} products from ${handles.length} collection(s). Upgrade for unlimited exports!`);
      } else {
        setSuccess(`Exported ${merged.length} products from ${handles.length} selected collection(s)!`);
      }
      
      exportToShopifyCSV(merged);
    } catch (err) {
      setError(err.message);
    } finally {
      setProgress('');
    }
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

  const clearFilters = () => {
    setSearchQuery('');
    setCollectionSearchQuery('');
    setFilters({
      vendor: '',
      tags: '',
      minPrice: '',
      maxPrice: '',
      productType: '',
      collection: [],
    });
    setCurrentPage(1);
  };

  const toggleCollection = (handle) => {
    setFilters(prev => ({
      ...prev,
      collection: prev.collection.includes(handle)
        ? prev.collection.filter(h => h !== handle)
        : [...prev.collection, handle]
    }));
  };

  const removeCollection = (handle) => {
    setFilters(prev => ({
      ...prev,
      collection: prev.collection.filter(h => h !== handle)
    }));
  };

  const filteredCollections = collections.filter(col => 
    col.title.toLowerCase().includes(collectionSearchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {startPage > 1 && (
          <>
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(number => (
          <button
            key={number}
            className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    );
  };

  return (
    <div className="scraper-page">
      <div className="scraper-container">
        <div className="scraper-header">
          <h1>Shopify Scraper</h1>
          <p>Extract Shopify products and export to CSV/Excel (no data storage)</p>
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
                placeholder="https://example.myshopify.com"
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
                <h3>Total Products ({filteredProducts.length})</h3>
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
                  {selectedIds.length > 0 && (
                    <button 
                      className="btn-primary" 
                      onClick={handleExportSelected}
                      title={`Export ${selectedIds.length} selected products`}
                    >
                    <Download size={16} />
                      Export Selected ({selectedIds.length})
                  </button>
                  )}
                  {filters.collection.length > 0 && (
                    <button 
                      className="btn-primary" 
                      onClick={() => handleExportByCollection(filters.collection)}
                      title={`Export products from ${filters.collection.length} selected collection(s)`}
                    >
                      <Download size={16} />
                      Export Selected Collections ({filters.collection.length})
                    </button>
                  )}
                  <button 
                    className="btn-outline" 
                    onClick={() => exportToShopifyCSV(filteredProducts.length > 0 ? filteredProducts : products)}
                    title={`Export ${filteredProducts.length > 0 ? filteredProducts.length : products.length} products`}
                  >
                    <Download size={16} />
                    Export Shopify ({filteredProducts.length > 0 ? filteredProducts.length : products.length})
                  </button>
                  <button 
                    className="btn-outline" 
                    onClick={() => exportToWooCommerceCSV(filteredProducts.length > 0 ? filteredProducts : products)}
                    title={`Export ${filteredProducts.length > 0 ? filteredProducts.length : products.length} products to WooCommerce`}
                  >
                    <Download size={16} />
                    Export to WooCommerce
                  </button>
                </div>
                
                <button className="btn-secondary" onClick={resetScraping}>
                  Reset
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="filters-panel">
                <div className="filters-grid">
                  <div className="form-group collection-filter-group">
                    <label>Collections</label>
                    <div className="collection-search-box">
                      <Search size={16} className="collection-search-icon" />
                      <input
                        type="text"
                        placeholder="Search collections..."
                        value={collectionSearchQuery}
                        onChange={(e) => setCollectionSearchQuery(e.target.value)}
                        className="collection-search-input"
                      />
                    </div>
                    
                    {filters.collection.length > 0 && (
                      <div className="selected-collections">
                        {filters.collection.map(handle => {
                          const col = collections.find(c => c.handle === handle);
                          return col ? (
                            <span key={handle} className="collection-chip">
                              {col.title}
                              <button
                                type="button"
                                onClick={() => removeCollection(handle)}
                                className="chip-remove"
                                title="Remove"
                              >
                                ×
                              </button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                    
                    <div className="collection-dropdown">
                      {filteredCollections.length > 0 ? (
                        filteredCollections.map(col => (
                          <div
                            key={col.id}
                            className={`collection-item ${filters.collection.includes(col.handle) ? 'selected' : ''}`}
                            onClick={() => toggleCollection(col.handle)}
                          >
                            <input
                              type="checkbox"
                              checked={filters.collection.includes(col.handle)}
                              onChange={() => {}}
                              className="collection-checkbox"
                            />
                            <span className="collection-name">{col.title}</span>
                          </div>
                        ))
                      ) : (
                        <div className="no-collections">
                          {collectionSearchQuery ? 'No collections found' : 'No collections available'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Vendor</label>
                    <input
                      type="text"
                      value={filters.vendor}
                      onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
                      placeholder="Filter by vendor"
                    />
                  </div>
                  <div className="form-group">
                    <label>Product Type</label>
                    <input
                      type="text"
                      value={filters.productType}
                      onChange={(e) => setFilters({ ...filters, productType: e.target.value })}
                      placeholder="Filter by type"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={filters.tags}
                      onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
                      placeholder="e.g., summer, sale"
                    />
                  </div>
                  <div className="form-group">
                    <label>Min Price</label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      placeholder="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Price</label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      placeholder="1000"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="filter-actions">
                  <button className="btn-link" onClick={clearFilters}>
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="search-bar">
              <div className="search-input-container">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products by title or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button 
                    className="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="products-summary">
              <p>
                Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
                {filters.vendor || filters.tags || filters.productType || filters.minPrice || filters.maxPrice ? ' (filtered)' : ''}
              </p>
              {renderPagination()}
            </div>

            <div className="table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={currentProducts.every(p => selectedIds.includes(p.id)) && currentProducts.length > 0}
                        onChange={(e) => toggleSelectAllCurrent(e.target.checked)}
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
                            alt={product.title}
                            className="product-image"
                          />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </td>
                      <td>
                        <div className="product-title">
                          {product.title}
                        </div>
                      </td>
                      <td>{product.sku || (product.variants?.[0]?.sku || '-')}</td>
                      <td>{product.vendor || '-'}</td>
                      <td>{product.product_type || '-'}</td>
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
                            href={product.url}
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

            {(selectedIds.length > 0 || totalPages > 1) && (
              <div className="pagination">
                {selectedIds.length > 0 && (
                  <>
                    <span className="pagination-info">{selectedIds.length} selected</span>
                    <button className="btn-secondary" onClick={handleExportSelected}>
                      <Download size={16} /> Export Selected
                    </button>
                  </>
                )}
                <button 
                  className="btn-secondary"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button 
                  className="btn-secondary"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scraper;


