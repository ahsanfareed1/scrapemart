import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, User, ArrowRight, Search } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PageBanner from '../components/layout/PageBanner';
import PageTransition from '../components/layout/PageTransition';
import './Blog.css';

const Blog = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: 'Ultimate Guide to Shopify Scraper: Extract Product Data in Minutes',
      excerpt: 'Learn how to use a Shopify scraper to extract thousands of products quickly. Complete guide for beginners and advanced users looking to scrape Shopify stores efficiently.',
      category: 'Shopify',
      date: 'January 20, 2025',
      author: 'ScrapeMart Team',
      readTime: '8 min read',
      slug: 'shopify-scraper-guide',
      featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
      content: `
        <h2>Why You Need a Shopify Scraper</h2>
        <p>Shopify powers millions of e-commerce stores worldwide. Whether you're conducting market research, migrating your store, or analyzing competitor pricing, a Shopify scraper is an essential tool for any e-commerce professional.</p>
        
        <h3>What is a Shopify Scraper?</h3>
        <p>A Shopify scraper is an automated tool that extracts publicly available product data from Shopify stores. This includes product names, descriptions, prices, images, variants, collections, and more.</p>
        
        <h3>Key Benefits of Using a Shopify Scraper:</h3>
        <ul>
          <li><strong>Save Time:</strong> Extract thousands of products in minutes instead of copying data manually</li>
          <li><strong>Market Research:</strong> Analyze competitor products, pricing strategies, and product ranges</li>
          <li><strong>Store Migration:</strong> Easily migrate from one Shopify store to another</li>
          <li><strong>Price Monitoring:</strong> Track competitor prices automatically</li>
          <li><strong>Product Sourcing:</strong> Find trending products and suppliers</li>
        </ul>
        
        <h3>How to Use ScrapeMart's Shopify Scraper</h3>
        <ol>
          <li><strong>Enter Store URL:</strong> Simply paste the Shopify store URL you want to scrape</li>
          <li><strong>Configure Filters:</strong> Set filters for collections, price ranges, vendors, or tags</li>
          <li><strong>Start Scraping:</strong> Click the scrape button and watch products load in real-time</li>
          <li><strong>Export Data:</strong> Download your data in CSV or JSON format, ready for import</li>
        </ol>
        
        <h3>Best Practices for Shopify Scraping</h3>
        <p>Always respect website terms of service and use scraping tools responsibly. Only scrape publicly available data and maintain reasonable rate limits to avoid overloading servers.</p>
        
        <h3>Common Use Cases</h3>
        <p><strong>Dropshippers:</strong> Find winning products and analyze successful stores</p>
        <p><strong>Store Owners:</strong> Migrate products or backup your catalog</p>
        <p><strong>Marketers:</strong> Research trending products and pricing strategies</p>
        <p><strong>Developers:</strong> Build price comparison tools and product databases</p>
      `
    },
    {
      id: 2,
      title: 'WooCommerce Scraper: How to Extract WordPress Store Data Easily',
      excerpt: 'Complete tutorial on using a WooCommerce scraper to extract product data from WordPress stores. Perfect for store migration, market research, and competitive analysis.',
      category: 'WooCommerce',
      date: 'January 18, 2025',
      author: 'ScrapeMart Team',
      readTime: '7 min read',
      slug: 'woocommerce-scraper-tutorial',
      featuredImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=600&fit=crop',
      content: `
        <h2>WooCommerce Scraper: Your Complete Guide</h2>
        <p>WooCommerce is the most popular e-commerce platform for WordPress, powering over 30% of all online stores. If you need to extract product data from WooCommerce stores, you need a reliable WooCommerce scraper.</p>
        
        <h3>What Can You Extract with a WooCommerce Scraper?</h3>
        <ul>
          <li>Product titles and descriptions</li>
          <li>Product prices (regular and sale prices)</li>
          <li>Product images and galleries</li>
          <li>Product categories and tags</li>
          <li>Product variations (size, color, etc.)</li>
          <li>SKUs and stock status</li>
          <li>Product reviews and ratings</li>
        </ul>
        
        <h3>Why Use ScrapeMart for WooCommerce Scraping?</h3>
        <p>Unlike generic scrapers, ScrapeMart is specifically designed for e-commerce platforms. Our WooCommerce scraper understands the structure of WooCommerce stores and can extract data accurately, including complex product variations.</p>
        
        <h3>Step-by-Step WooCommerce Scraping Process</h3>
        <ol>
          <li><strong>Identify Target Store:</strong> Find the WooCommerce store you want to scrape</li>
          <li><strong>Enter URL:</strong> Paste the store URL into ScrapeMart</li>
          <li><strong>Select Export Format:</strong> Choose between Shopify CSV, WooCommerce CSV, or JSON</li>
          <li><strong>Apply Filters:</strong> Filter by category, price range, or other criteria</li>
          <li><strong>Export Data:</strong> Download your extracted data instantly</li>
        </ol>
        
        <h3>WooCommerce to Shopify Migration</h3>
        <p>One of the most popular use cases is migrating from WooCommerce to Shopify. ScrapeMart makes this easy by exporting WooCommerce data in Shopify-compatible CSV format.</p>
        
        <h3>Legal Considerations</h3>
        <p>Always ensure you have the right to access and use the data you're scraping. Only scrape publicly available data and respect robots.txt files.</p>
      `
    },
    {
      id: 3,
      title: 'Shopify Store Migration: Export and Import Products in 3 Easy Steps',
      excerpt: 'Moving to a new Shopify store? Learn how to export products from any Shopify store and import them seamlessly. Complete guide to Shopify store migration.',
      category: 'Tutorials',
      date: 'January 15, 2025',
      author: 'Sarah Johnson',
      readTime: '6 min read',
      slug: 'shopify-store-migration-guide',
      featuredImage: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=1200&h=600&fit=crop',
      content: `
        <h2>Shopify Store Migration Made Simple</h2>
        <p>Migrating your Shopify store doesn't have to be complicated. Whether you're rebranding, consolidating multiple stores, or moving to a new domain, this guide will show you how to migrate products quickly and accurately.</p>
        
        <h3>Why Migrate Your Shopify Store?</h3>
        <ul>
          <li>Rebranding or domain change</li>
          <li>Consolidating multiple stores</li>
          <li>Backing up your product catalog</li>
          <li>Creating a test store</li>
          <li>Transferring ownership</li>
        </ul>
        
        <h3>3-Step Migration Process</h3>
        
        <h4>Step 1: Export Products from Your Current Store</h4>
        <p>Use ScrapeMart to export all products from your existing Shopify store. Simply enter your store URL and export to CSV format. You'll get a Shopify-compatible file with all product data including:</p>
        <ul>
          <li>Product titles and descriptions</li>
          <li>Prices and compare-at prices</li>
          <li>Product images</li>
          <li>Variants (sizes, colors, etc.)</li>
          <li>Collections and tags</li>
          <li>SEO metadata</li>
        </ul>
        
        <h4>Step 2: Review and Clean Your Data</h4>
        <p>Before importing, review your CSV file. This is a great opportunity to:</p>
        <ul>
          <li>Update outdated descriptions</li>
          <li>Adjust pricing</li>
          <li>Remove discontinued products</li>
          <li>Update SEO titles and descriptions</li>
        </ul>
        
        <h4>Step 3: Import to Your New Store</h4>
        <p>In your new Shopify store admin, go to Products > Import and upload your CSV file. Shopify will process the import and create all products automatically.</p>
        
        <h3>Pro Tips for Successful Migration</h3>
        <ul>
          <li><strong>Test First:</strong> Create a test store and import a few products first</li>
          <li><strong>Backup Images:</strong> Download product images separately as backup</li>
          <li><strong>Update URLs:</strong> Set up URL redirects from old to new store</li>
          <li><strong>Check Variants:</strong> Ensure all product variants imported correctly</li>
        </ul>
        
        <h3>Common Migration Challenges and Solutions</h3>
        <p><strong>Issue:</strong> Images not importing<br/>
        <strong>Solution:</strong> Ensure image URLs are publicly accessible</p>
        
        <p><strong>Issue:</strong> Variants not matching<br/>
        <strong>Solution:</strong> Check variant option names are consistent</p>
      `
    },
    {
      id: 4,
      title: 'Competitive Analysis: How to Scrape Competitor Product Data Legally',
      excerpt: 'Learn how to perform competitive analysis by scraping competitor product data legally and ethically. Essential guide for e-commerce businesses and marketers.',
      category: 'Market Research',
      date: 'January 12, 2025',
      author: 'Michael Chen',
      readTime: '9 min read',
      slug: 'competitive-analysis-product-scraping',
      featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
      content: `
        <h2>Competitive Analysis Through Product Data Scraping</h2>
        <p>In e-commerce, understanding your competition is crucial for success. Product data scraping allows you to gather competitive intelligence quickly and efficiently.</p>
        
        <h3>What Data Should You Track?</h3>
        <ul>
          <li><strong>Pricing:</strong> Monitor competitor prices and discounts</li>
          <li><strong>Product Range:</strong> See what products they offer</li>
          <li><strong>Product Descriptions:</strong> Analyze how they position products</li>
          <li><strong>Images:</strong> Study their visual presentation</li>
          <li><strong>Reviews:</strong> Understand customer sentiment</li>
          <li><strong>Stock Levels:</strong> Identify bestsellers</li>
        </ul>
        
        <h3>Legal and Ethical Scraping</h3>
        <p>It's important to scrape responsibly:</p>
        <ul>
          <li>Only scrape publicly available data</li>
          <li>Respect robots.txt files</li>
          <li>Use reasonable rate limits</li>
          <li>Don't bypass authentication</li>
          <li>Review website terms of service</li>
          <li>Don't republish scraped content as-is</li>
        </ul>
        
        <h3>How to Use Scraped Data for Analysis</h3>
        
        <h4>1. Price Analysis</h4>
        <p>Compare your prices against competitors. Identify opportunities to adjust pricing for better margins or competitiveness.</p>
        
        <h4>2. Product Gap Analysis</h4>
        <p>Find products your competitors sell that you don't. Identify potential new product opportunities.</p>
        
        <h4>3. Description Optimization</h4>
        <p>Analyze how competitors describe similar products. Improve your own product descriptions based on insights.</p>
        
        <h4>4. Trend Identification</h4>
        <p>Track which products competitors add or remove. Identify trending products early.</p>
        
        <h3>Best Practices for Competitive Intelligence</h3>
        <ul>
          <li>Scrape regularly (weekly or monthly) to track changes</li>
          <li>Track 3-5 main competitors</li>
          <li>Focus on your top product categories</li>
          <li>Combine scraped data with other market research</li>
          <li>Use data to inform strategy, not copy competitors</li>
        </ul>
        
        <h3>Tools You Need</h3>
        <p>ScrapeMart makes competitive analysis easy with features like:</p>
        <ul>
          <li>Automated scheduling (coming soon)</li>
          <li>Price change alerts (coming soon)</li>
          <li>Bulk export for multiple stores</li>
          <li>Data comparison tools</li>
        </ul>
      `
    },
    {
      id: 5,
      title: 'Top 10 Shopify Scraper Use Cases for E-commerce Success in 2025',
      excerpt: 'Discover the most powerful ways to use a Shopify scraper in 2025. From dropshipping to market research, learn how successful merchants leverage data extraction.',
      category: 'Shopify',
      date: 'January 10, 2025',
      author: 'Emily Rodriguez',
      readTime: '10 min read',
      slug: 'shopify-scraper-use-cases-2025',
      featuredImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=600&fit=crop',
      content: `
        <h2>10 Powerful Shopify Scraper Use Cases</h2>
        <p>A Shopify scraper is more than just a data extraction tool. Here are the top 10 ways successful e-commerce businesses use Shopify scrapers in 2025.</p>
        
        <h3>1. Dropshipping Product Research</h3>
        <p>Find winning products by analyzing successful dropshipping stores. Scrape products, analyze reviews, and identify trending items before they become saturated.</p>
        
        <h3>2. Store Migration and Backup</h3>
        <p>Whether moving to a new platform or creating backups, scraping your own Shopify store ensures you never lose valuable product data.</p>
        
        <h3>3. Price Monitoring and Optimization</h3>
        <p>Track competitor prices automatically. Adjust your pricing strategy based on market data to stay competitive while maintaining margins.</p>
        
        <h3>4. Product Catalog Creation</h3>
        <p>Building a new store? Scrape products from multiple sources to quickly create a comprehensive catalog in your niche.</p>
        
        <h3>5. Market Research and Analysis</h3>
        <p>Analyze entire markets by scraping multiple stores. Identify gaps, opportunities, and emerging trends in your industry.</p>
        
        <h3>6. Inventory Planning</h3>
        <p>Monitor what products your competitors stock. Plan your inventory based on market demand and availability.</p>
        
        <h3>7. SEO and Content Analysis</h3>
        <p>Study how successful stores write product titles and descriptions. Improve your own SEO based on what works.</p>
        
        <h3>8. Supplier Discovery</h3>
        <p>Find vendors and manufacturers by analyzing product information across multiple stores.</p>
        
        <h3>9. Brand Monitoring</h3>
        <p>If you're a brand owner, monitor unauthorized sellers and ensure pricing consistency across retailers.</p>
        
        <h3>10. Data-Driven Product Development</h3>
        <p>Analyze product variations, features, and pricing across the market to inform new product development.</p>
        
        <h3>Getting Started</h3>
        <p>Ready to leverage these use cases? ScrapeMart makes it easy to extract Shopify data with:</p>
        <ul>
          <li>No coding required</li>
          <li>Real-time data extraction</li>
          <li>Multiple export formats</li>
          <li>Advanced filtering options</li>
          <li>Unlimited products (Pro plan)</li>
        </ul>
        
        <h3>Best Practices</h3>
        <ul>
          <li>Always use scraped data ethically and legally</li>
          <li>Don't copy content directly - use it for inspiration</li>
          <li>Respect intellectual property rights</li>
          <li>Combine scraped data with your own insights</li>
          <li>Focus on adding value, not just copying competitors</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Whether you're a dropshipper, store owner, marketer, or developer, a Shopify scraper is an essential tool in 2025. Start using ScrapeMart today to gain competitive advantages and grow your e-commerce business.</p>
      `
    }
  ];

  const categories = ['all', 'Shopify', 'WooCommerce', 'Tutorials', 'Market Research'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageTransition>
      <div className="blog-page">
        <Header />
        
        <PageBanner 
          title="Blog & Resources"
          subtitle="Expert guides, tutorials, and insights for e-commerce data extraction"
          icon={<FileText size={32} />}
        />

        <div className="blog-content">
          <div className="container">
            {/* Search and Filter */}
            <div className="blog-filters">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'All Articles' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="blog-grid">
              {filteredPosts.map(post => (
                <article key={post.id} className="blog-card">
                  <div 
                    className="blog-card-image" 
                    style={{ backgroundImage: `url(${post.featuredImage})` }}
                  >
                    <span className="blog-category-badge">{post.category}</span>
                  </div>
                  
                  <div className="blog-card-content">
                    <h2>{post.title}</h2>
                    <p className="blog-excerpt">{post.excerpt}</p>
                    
                    <div className="blog-meta">
                      <span className="meta-item">
                        <Calendar size={16} />
                        {post.date}
                      </span>
                      <span className="meta-item">
                        <User size={16} />
                        {post.author}
                      </span>
                      <span className="meta-item">{post.readTime}</span>
                    </div>
                    
                    <button 
                      className="read-more-btn"
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      Read More
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="no-results">
                <p>No articles found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Blog;

