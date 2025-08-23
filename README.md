# AffiliateHub - Complete Affiliate Marketing Platform

A production-ready affiliate marketing platform built with React, TypeScript, Supabase, and TailwindCSS.

## 🚀 Features

### ✅ Core Features Implemented
- **Authentication**: Email/password + role-based access (Admin, Affiliate, Advertiser)
- **Affiliate System**: Unique referral links, click/conversion tracking, earnings dashboard
- **Campaign Management**: Create and join campaigns with commission tracking
- **Wallet System**: Earnings tracking, transaction history, payout requests
- **Blog System**: SEO-friendly blog with individual post pages
- **Edge Functions**: Real-time tracking APIs for clicks, conversions, and payouts

### 🛠️ Tech Stack
- **Frontend**: React 18 + Vite + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Supabase (Database + Auth + Edge Functions)
- **Database**: PostgreSQL with Row Level Security
- **Styling**: Custom design system with semantic tokens

## 🧪 Testing the Platform

### Test User Accounts
1. **Sign up at `/auth`** - Choose your role (affiliate/advertiser)
2. **Affiliate Flow**: Join campaigns → Get referral links → Track earnings
3. **Advertiser Flow**: Create campaigns → Set commissions → Monitor performance

### Test Referral Tracking
- Referral links follow format: `/ref/[8-character-code]`
- Click tracking works automatically via Edge Functions
- Conversion tracking can be triggered via API

### Test Campaigns
Sample campaigns are available in the database for testing affiliate functionality.

## 📊 Database Schema

### Core Tables
- `profiles` - User profiles with roles and wallet info
- `campaigns` - Advertiser campaigns with commission settings
- `referrals` - Unique affiliate referral codes per campaign
- `clicks` - Click tracking with IP and user agent
- `conversions` - Conversion events with commission calculations
- `wallet_transactions` - Earnings, payouts, and transaction history
- `blog_posts` - Content management for blog system

### Security
- Row Level Security (RLS) on all tables
- Role-based access control
- JWT authentication via Supabase Auth

## 🔧 Development

### Local Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Edge Functions
Located in `supabase/functions/`:
- `track-click` - Records referral clicks
- `track-conversion` - Processes conversions and calculates commissions
- `payout` - Handles affiliate payout processing

## 🚀 Deployment

**Frontend**: Deploys automatically via Vercel/Netlify
**Backend**: Supabase handles database and Edge Functions automatically

## 📈 Current Status

### ✅ Completed
- Core affiliate tracking system
- Authentication and user management
- Campaign browsing and joining
- Earnings and wallet system
- Blog with SEO optimization
- Responsive design system

### 🔄 Next Phase (Coming Soon)
- Advertiser dashboard for campaign creation
- Admin dashboard for user/campaign management
- Advanced analytics and reporting
- PayPal integration for automated payouts
- Fraud detection system

## 🔗 Key Routes

- `/` - Landing page with featured campaigns
- `/auth` - Authentication (login/signup)
- `/blog` - Blog listing and individual posts
- `/dashboard` - User dashboard (role-specific)
- `/dashboard/campaigns` - Browse and join campaigns (affiliates)
- `/dashboard/wallet` - Earnings and payout management (affiliates)
- `/ref/:code` - Referral link tracking

## 📞 Support

For questions or issues, refer to the troubleshooting documentation or contact support.

---

**Project URL**: https://lovable.dev/projects/bb9dfa34-f6ca-4fac-b8e4-8bfc10faf67f
