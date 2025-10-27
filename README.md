# ScrapeMart - Professional Shopify Scraper

A complete SaaS application for scraping Shopify stores with authentication, project management, and subscription billing.

## Features

- **Professional Landing Page** with pricing plans
- **User Authentication** (Sign Up, Sign In, Password Reset)
- **Project Management** - Organize scraping tasks
- **Live Scraping Preview** with real-time progress
- **Advanced Filtering** by vendor, tags, price range, etc.
- **Export Functionality** - CSV in Shopify format
- **Team Collaboration** (Pro plan)
- **Subscription Billing** with Stripe integration
- **Usage Limits** - Free: 50 products, Pro: Unlimited

## Tech Stack

### Frontend
- React 18
- React Router
- Supabase Auth
- Stripe Elements
- Lucide React (Icons)

### Backend
- Node.js + Express
- Supabase (Database + Auth)
- Stripe (Payments)
- JWT Authentication
- Rate Limiting

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Get your project URL and anon key from Settings > API

### 2. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Create products and prices for your subscription plans
4. Set up webhook endpoint: `https://yourdomain.com/api/billing/webhook`

### 3. Environment Variables

#### Server (.env)
   ```env
# Server Configuration
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000

# Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
STRIPE_PRICE_ID_FREE=price_free_id
STRIPE_PRICE_ID_PRO=price_pro_id

# Application URLs
FRONTEND_URL=http://localhost:3000
```

#### Client (.env)
```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# API Configuration
REACT_APP_API_URL=http://localhost:5000
```

### 4. Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 5. Running the Application

```bash
# Start the server (from server directory)
npm run dev

# Start the client (from client directory)
npm start
```

## Database Schema

The application uses the following main tables:

- **profiles** - User profiles extending Supabase auth
- **projects** - Scraping projects
- **products** - Scraped product data
- **teams** - Team management
- **team_members** - Team member relationships
- **subscriptions** - Stripe subscription data
- **scraping_jobs** - Scraping progress tracking

## API Endpoints

### Authentication Required
- `POST /api/scraper/scrape` - Scrape Shopify store
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/products` - Get project products
- `GET /api/stats` - Get user statistics

### Billing
- `POST /api/billing/create-checkout-session` - Create Stripe checkout
- `POST /api/billing/create-portal-session` - Create billing portal
- `POST /api/billing/webhook` - Stripe webhook handler

## Deployment

### Frontend (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy the build folder
3. Set environment variables

### Backend (Railway/Heroku)
1. Deploy the server folder
2. Set all environment variables
3. Configure Stripe webhook URL

## Usage Limits

- **Free Plan**: 50 products per month, 1 project
- **Pro Plan**: Unlimited products, unlimited projects, team collaboration

## Security Features

- JWT authentication
- Rate limiting
- CORS protection
- Input validation
- SQL injection protection via Supabase
- XSS protection

## Support

For support, please contact [your-email@domain.com]