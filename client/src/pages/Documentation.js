import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Search, ChevronRight, CheckCircle, Rocket, ShoppingBag, ShoppingCart, Settings, Wrench } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import PageTransition from '../components/layout/PageTransition';
import './Documentation.css';

const Documentation = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');

  const docSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Rocket,
      articles: [
        {
          title: 'Quick Start Guide',
          content: `
            <h3>Welcome to ScrapeMart!</h3>
            <p>Get up and running in less than 5 minutes with this quick start guide.</p>
            
            <h4>Step 1: Create an Account</h4>
            <ol>
              <li>Click "Sign Up" in the top right corner</li>
              <li>Enter your email and create a password</li>
              <li>Verify your email address</li>
              <li>Choose your plan (Free or Pro)</li>
            </ol>
            
            <h4>Step 2: Access the Scraper</h4>
            <p>Once logged in, navigate to the Dashboard and select either:</p>
            <ul>
              <li><strong>Shopify Scraper</strong> - For Shopify stores</li>
              <li><strong>WooCommerce Scraper</strong> - For WordPress/WooCommerce stores</li>
            </ul>
            
            <h4>Step 3: Scrape Your First Store</h4>
            <ol>
              <li>Enter the store URL (e.g., https://example.myshopify.com)</li>
              <li>Check the consent checkbox</li>
              <li>Click "Scrape"</li>
              <li>Watch as products load in real-time</li>
              <li>Export to CSV or JSON when complete</li>
            </ol>
            
            <div class="tip-box">
              <strong>💡 Pro Tip:</strong> Start with a smaller store (100-500 products) to familiarize yourself with the interface.
            </div>
          `
        },
        {
          title: 'Account Setup',
          content: `
            <h3>Setting Up Your Account</h3>
            
            <h4>Account Types</h4>
            <p><strong>Free Forever Plan:</strong></p>
            <ul>
              <li>50 products per export</li>
              <li>Shopify & WooCommerce support</li>
              <li>CSV, Excel, and JSON export</li>
              <li>Basic filters</li>
              <li>Email support</li>
            </ul>
            
            <p><strong>Pro Plan ($19.99/month):</strong></p>
            <ul>
              <li>Unlimited products</li>
              <li>All export formats</li>
              <li>Advanced filtering</li>
              <li>Priority support</li>
              <li>24/7 customer support</li>
            </ul>
            
            <h4>Upgrading Your Plan</h4>
            <ol>
              <li>Go to Dashboard > Billing</li>
              <li>Click "Upgrade to Pro"</li>
              <li>Enter payment information</li>
              <li>Confirm subscription</li>
            </ol>
            
            <h4>Managing Your Profile</h4>
            <p>Update your profile information in Dashboard > Settings:</p>
            <ul>
              <li>Change email address</li>
              <li>Update password</li>
              <li>Set notification preferences</li>
              <li>Manage team members (Pro plan)</li>
            </ul>
          `
        }
      ]
    },
    {
      id: 'shopify-scraper',
      title: 'Shopify Scraper',
      icon: ShoppingBag,
      articles: [
        {
          title: 'How to Use Shopify Scraper',
          content: `
            <h3>Scraping Shopify Stores</h3>
            
            <h4>Finding Shopify Stores</h4>
            <p>Shopify stores typically have URLs ending in .myshopify.com or use custom domains. You can identify a Shopify store by:</p>
            <ul>
              <li>Checking the page source for "Shopify" references</li>
              <li>Looking for /cart in the URL structure</li>
              <li>Using browser extensions like Wappalyzer</li>
            </ul>
            
            <h4>Entering the Store URL</h4>
            <ol>
              <li>Copy the full store URL (including https://)</li>
              <li>Paste it into the "Store URL" field</li>
              <li>The URL should look like: https://example.myshopify.com</li>
            </ol>
            
            <h4>Using Filters</h4>
            <p>Before scraping, you can apply filters to target specific products:</p>
            <ul>
              <li><strong>Collections:</strong> Select specific product collections</li>
              <li><strong>Price Range:</strong> Set minimum and maximum prices</li>
              <li><strong>Vendor:</strong> Filter by brand or manufacturer</li>
              <li><strong>Tags:</strong> Filter by product tags</li>
              <li><strong>Product Type:</strong> Filter by category</li>
            </ul>
            
            <h4>Starting the Scrape</h4>
            <ol>
              <li>Review your filters</li>
              <li>Check the consent checkbox</li>
              <li>Click the "Scrape" button</li>
              <li>Monitor progress in real-time</li>
            </ol>
            
            <h4>Understanding the Results</h4>
            <p>As products are scraped, you'll see:</p>
            <ul>
              <li>Product count updating in real-time</li>
              <li>Products appearing in the table below</li>
              <li>Progress indicator showing completion status</li>
            </ul>
            
            <div class="warning-box">
              <strong>⚠️ Important:</strong> Scraping may take several minutes for stores with thousands of products. Don't close the browser tab while scraping is in progress.
            </div>
          `
        },
        {
          title: 'Exporting Shopify Data',
          content: `
            <h3>Export Options for Shopify Data</h3>
            
            <h4>Export Formats</h4>
            <p><strong>1. Shopify CSV Format:</strong></p>
            <ul>
              <li>Ready for direct import into Shopify</li>
              <li>Includes all product variants</li>
              <li>Preserves product options and images</li>
              <li>Compatible with Shopify's CSV import</li>
            </ul>
            
            <p><strong>2. WooCommerce CSV Format:</strong></p>
            <ul>
              <li>Convert Shopify products to WooCommerce format</li>
              <li>Perfect for platform migration</li>
              <li>Includes all necessary WooCommerce fields</li>
            </ul>
            
            <p><strong>3. JSON Format:</strong></p>
            <ul>
              <li>For developers and custom integrations</li>
              <li>Complete product data structure</li>
              <li>Easy to parse and manipulate</li>
            </ul>
            
            <h4>How to Export</h4>
            <ol>
              <li><strong>Export All Products:</strong> Click "Export Shopify" to download all scraped products</li>
              <li><strong>Export Selected:</strong> Select specific products and click "Export Selected"</li>
              <li><strong>Export by Collection:</strong> Use collection filters and export filtered results</li>
            </ol>
            
            <h4>Import into Shopify</h4>
            <p>To import the CSV into a Shopify store:</p>
            <ol>
              <li>Log into your Shopify admin</li>
              <li>Go to Products > Import</li>
              <li>Upload the CSV file</li>
              <li>Map any custom fields (usually automatic)</li>
              <li>Click "Import Products"</li>
            </ol>
            
            <div class="tip-box">
              <strong>💡 Pro Tip:</strong> Always test with a small subset of products first to ensure proper formatting.
            </div>
          `
        }
      ]
    },
    {
      id: 'woocommerce-scraper',
      title: 'WooCommerce Scraper',
      icon: ShoppingCart,
      articles: [
        {
          title: 'How to Use WooCommerce Scraper',
          content: `
            <h3>Scraping WooCommerce Stores</h3>
            
            <h4>Identifying WooCommerce Stores</h4>
            <p>WooCommerce stores are WordPress sites with the WooCommerce plugin. You can identify them by:</p>
            <ul>
              <li>Checking for /product/ in URLs</li>
              <li>Looking for "Add to Cart" buttons</li>
              <li>Using Wappalyzer or similar tools</li>
              <li>Checking page source for "woocommerce" references</li>
            </ul>
            
            <h4>Entering the Store URL</h4>
            <ol>
              <li>Copy the store homepage URL</li>
              <li>Paste into the WooCommerce Scraper</li>
              <li>Example: https://example.com</li>
            </ol>
            
            <h4>WooCommerce-Specific Features</h4>
            <ul>
              <li><strong>Variable Products:</strong> Automatically extracts all product variations</li>
              <li><strong>Product Attributes:</strong> Captures custom attributes (size, color, etc.)</li>
              <li><strong>Categories:</strong> Preserves product category structure</li>
              <li><strong>Sale Prices:</strong> Distinguishes between regular and sale prices</li>
            </ul>
            
            <h4>Handling Complex Products</h4>
            <p>WooCommerce supports several product types:</p>
            <ul>
              <li><strong>Simple Products:</strong> Basic products with no variations</li>
              <li><strong>Variable Products:</strong> Products with multiple options (size, color, etc.)</li>
              <li><strong>Grouped Products:</strong> Collections of related products</li>
              <li><strong>Virtual Products:</strong> Digital products with no shipping</li>
            </ul>
            
            <p>ScrapeMart handles all these product types automatically.</p>
            
            <div class="tip-box">
              <strong>💡 Pro Tip:</strong> WooCommerce stores may have different URL structures. If the main URL doesn't work, try adding /shop/ to the end.
            </div>
          `
        },
        {
          title: 'WooCommerce to Shopify Migration',
          content: `
            <h3>Migrating from WooCommerce to Shopify</h3>
            
            <h4>Why Migrate?</h4>
            <ul>
              <li>Simpler store management</li>
              <li>Better hosting and performance</li>
              <li>Integrated payment processing</li>
              <li>24/7 support from Shopify</li>
              <li>Lower technical maintenance</li>
            </ul>
            
            <h4>Migration Process</h4>
            
            <p><strong>Step 1: Export from WooCommerce</strong></p>
            <ol>
              <li>Enter your WooCommerce store URL</li>
              <li>Scrape all products</li>
              <li>Select "Export to Shopify CSV"</li>
              <li>Download the Shopify-formatted CSV</li>
            </ol>
            
            <p><strong>Step 2: Prepare Your Shopify Store</strong></p>
            <ol>
              <li>Create a new Shopify store (or use existing)</li>
              <li>Set up your store theme</li>
              <li>Configure payment and shipping settings</li>
              <li>Create collections (categories) to match WooCommerce</li>
            </ol>
            
            <p><strong>Step 3: Import Products</strong></p>
            <ol>
              <li>In Shopify admin, go to Products</li>
              <li>Click Import</li>
              <li>Upload the CSV file from ScrapeMart</li>
              <li>Review and confirm import</li>
              <li>Wait for processing to complete</li>
            </ol>
            
            <p><strong>Step 4: Verify and Adjust</strong></p>
            <ul>
              <li>Check product images loaded correctly</li>
              <li>Verify variants and options</li>
              <li>Update product collections/categories</li>
              <li>Test checkout process</li>
              <li>Set up URL redirects from old site</li>
            </ul>
            
            <h4>Common Migration Issues</h4>
            <p><strong>Issue:</strong> Product images not importing</p>
            <p><strong>Solution:</strong> Ensure image URLs are publicly accessible. Download images locally and re-upload to Shopify if needed.</p>
            
            <p><strong>Issue:</strong> Product variants not matching</p>
            <p><strong>Solution:</strong> Check variant naming conventions. Shopify supports up to 3 variant options.</p>
            
            <p><strong>Issue:</strong> Missing product categories</p>
            <p><strong>Solution:</strong> Create collections in Shopify first, then map products to collections using tags or manual assignment.</p>
          `
        }
      ]
    },
    {
      id: 'features',
      title: 'Features',
      icon: Settings,
      articles: [
        {
          title: 'Advanced Filtering',
          content: `
            <h3>Using Advanced Filters</h3>
            
            <h4>Why Use Filters?</h4>
            <ul>
              <li>Scrape only the products you need</li>
              <li>Save time and bandwidth</li>
              <li>Focus on specific product categories</li>
              <li>Avoid unnecessary data</li>
            </ul>
            
            <h4>Available Filters</h4>
            
            <p><strong>1. Collection Filter:</strong></p>
            <ul>
              <li>Select one or multiple collections</li>
              <li>Scrapes only products in selected collections</li>
              <li>Great for targeting specific product categories</li>
            </ul>
            
            <p><strong>2. Price Range Filter:</strong></p>
            <ul>
              <li>Set minimum price</li>
              <li>Set maximum price</li>
              <li>Perfect for budget-focused scraping</li>
            </ul>
            
            <p><strong>3. Vendor Filter:</strong></p>
            <ul>
              <li>Filter by brand or manufacturer</li>
              <li>Scrape products from specific vendors</li>
              <li>Useful for brand-specific research</li>
            </ul>
            
            <p><strong>4. Tag Filter:</strong></p>
            <ul>
              <li>Filter by product tags</li>
              <li>Supports multiple tags (comma-separated)</li>
              <li>Find products with specific attributes</li>
            </ul>
            
            <p><strong>5. Product Type Filter:</strong></p>
            <ul>
              <li>Filter by product category/type</li>
              <li>Target specific product segments</li>
            </ul>
            
            <h4>Combining Filters</h4>
            <p>You can combine multiple filters for precise targeting:</p>
            <ul>
              <li>Collection: "Summer Collection"</li>
              <li>Price Range: $20 - $100</li>
              <li>Vendor: "Nike"</li>
              <li>Tags: "trending, sale"</li>
            </ul>
            
            <p>This will scrape only Nike products in the Summer Collection, priced between $20-$100, with trending or sale tags.</p>
            
            <div class="tip-box">
              <strong>💡 Pro Tip:</strong> Use filters to create targeted exports for different purposes (seasonal products, price segments, brand-specific catalogs, etc.)
            </div>
          `
        },
        {
          title: 'Search and Select Products',
          content: `
            <h3>Searching and Selecting Products</h3>
            
            <h4>Search Functionality</h4>
            <p>After scraping, use the search bar to find specific products:</p>
            <ul>
              <li>Search by product title</li>
              <li>Search by SKU</li>
              <li>Real-time filtering as you type</li>
              <li>Case-insensitive search</li>
            </ul>
            
            <h4>Selecting Products</h4>
            
            <p><strong>Individual Selection:</strong></p>
            <ul>
              <li>Click checkbox next to any product</li>
              <li>Select multiple products individually</li>
              <li>Selection persists across pages</li>
            </ul>
            
            <p><strong>Select All on Current Page:</strong></p>
            <ul>
              <li>Click checkbox in table header</li>
              <li>Selects all products on current page</li>
              <li>Click again to deselect all</li>
            </ul>
            
            <h4>Exporting Selected Products</h4>
            <ol>
              <li>Select the products you want to export</li>
              <li>Click "Export Selected" button</li>
              <li>Choose your export format</li>
              <li>Download begins automatically</li>
            </ol>
            
            <h4>Viewing Product Details</h4>
            <p>Each product row shows:</p>
            <ul>
              <li>Product image</li>
              <li>Product title</li>
              <li>SKU</li>
              <li>Vendor/Brand</li>
              <li>Product type</li>
              <li>Price</li>
              <li>Compare at price</li>
              <li>Action buttons (View, Export)</li>
            </ul>
            
            <p>Click the eye icon to view the product on the original store.</p>
          `
        },
        {
          title: 'Pagination and Viewing',
          content: `
            <h3>Navigating Results</h3>
            
            <h4>Pagination Controls</h4>
            <p>Results are displayed 25 products per page:</p>
            <ul>
              <li><strong>First:</strong> Jump to first page</li>
              <li><strong>Previous:</strong> Go to previous page</li>
              <li><strong>Page Numbers:</strong> Click to jump to specific page</li>
              <li><strong>Next:</strong> Go to next page</li>
              <li><strong>Last:</strong> Jump to last page</li>
            </ul>
            
            <h4>Results Summary</h4>
            <p>At the top of results, you'll see:</p>
            <ul>
              <li>Total products found</li>
              <li>Current page range (e.g., "Showing 1-25 of 250")</li>
              <li>Filter status (if filters applied)</li>
            </ul>
            
            <h4>Real-Time Updates</h4>
            <p>During scraping, products appear in real-time:</p>
            <ul>
              <li>New products added as they're scraped</li>
              <li>Counter updates continuously</li>
              <li>You can browse while scraping continues</li>
            </ul>
            
            <div class="tip-box">
              <strong>💡 Pro Tip:</strong> Use the search function to quickly find specific products in large result sets.
            </div>
          `
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: Wrench,
      articles: [
        {
          title: 'Common Issues and Solutions',
          content: `
            <h3>Troubleshooting Guide</h3>
            
            <h4>Scraping Fails or Returns No Products</h4>
            <p><strong>Possible Causes:</strong></p>
            <ul>
              <li>Invalid or incorrect URL</li>
              <li>Store has no products or products are hidden</li>
              <li>Store requires authentication</li>
              <li>Store blocks automated access</li>
            </ul>
            
            <p><strong>Solutions:</strong></p>
            <ul>
              <li>Verify the URL is correct and accessible in a browser</li>
              <li>Check if store has publicly visible products</li>
              <li>Ensure you're not trying to scrape password-protected areas</li>
              <li>Try again later if store is temporarily blocking requests</li>
            </ul>
            
            <h4>Images Not Exporting</h4>
            <p><strong>Possible Causes:</strong></p>
            <ul>
              <li>Image URLs are not publicly accessible</li>
              <li>Images are protected by authentication</li>
              <li>Image URLs are relative paths</li>
            </ul>
            
            <p><strong>Solutions:</strong></p>
            <ul>
              <li>Check if images are visible when visiting product pages</li>
              <li>Download images separately if needed</li>
              <li>Contact support if issue persists</li>
            </ul>
            
            <h4>Export Limit Reached (Free Plan)</h4>
            <p><strong>Issue:</strong> Can only export 50 products at a time</p>
            <p><strong>Solutions:</strong></p>
            <ul>
              <li>Select your 50 most important products</li>
              <li>Export multiple times with different filters</li>
              <li>Upgrade to Pro plan for unlimited exports</li>
            </ul>
            
            <h4>Slow Scraping Performance</h4>
            <p><strong>Possible Causes:</strong></p>
            <ul>
              <li>Large store with thousands of products</li>
              <li>Slow server response from target store</li>
              <li>High traffic on target store</li>
            </ul>
            
            <p><strong>Solutions:</strong></p>
            <ul>
              <li>Be patient - large stores take time</li>
              <li>Use filters to reduce scraping scope</li>
              <li>Try during off-peak hours</li>
            </ul>
            
            <h4>Consent Checkbox Error</h4>
            <p><strong>Issue:</strong> Cannot start scraping without checking consent</p>
            <p><strong>Solution:</strong> Read and agree to the terms by checking the consent checkbox. This is required for legal compliance.</p>
            
            <div class="warning-box">
              <strong>⚠️ Still Having Issues?</strong> Contact our support team at support@scrapemart.com with details about your issue.
            </div>
          `
        }
      ]
    }
  ];

  const activeContent = docSections.find(section => section.id === activeSection);

  return (
    <PageTransition>
      <div className="documentation-page">
        <Header />
        
        <PageBanner 
          title="Documentation"
          subtitle="Complete guide to using ScrapeMart"
          icon={<Book size={32} />}
        />

        <div className="documentation-content">
          <div className="container">
            <div className="doc-layout">
              {/* Sidebar Navigation */}
              <aside className="doc-sidebar">
                <div className="doc-search">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search docs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <nav className="doc-nav">
                  {docSections.map(section => {
                    const IconComponent = section.icon;
                    return (
                      <button
                        key={section.id}
                        className={`doc-nav-item ${activeSection === section.id ? 'active' : ''}`}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <span className="doc-icon"><IconComponent size={20} /></span>
                        <span>{section.title}</span>
                        <ChevronRight size={18} />
                      </button>
                    );
                  })}
                </nav>
              </aside>

              {/* Main Content */}
              <main className="doc-main">
                <div className="doc-header">
                  <h1>{activeContent?.title}</h1>
                </div>

                {activeContent?.articles.map((article, index) => (
                  <div key={index} className="doc-article">
                    <h2>{article.title}</h2>
                    <div 
                      className="doc-content"
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                  </div>
                ))}
              </main>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Documentation;

