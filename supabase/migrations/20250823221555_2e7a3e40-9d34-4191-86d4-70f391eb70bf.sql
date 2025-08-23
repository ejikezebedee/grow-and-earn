-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'affiliate', 'advertiser');

-- PROFILES (extend auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role app_role DEFAULT 'affiliate',
  wallet_address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CAMPAIGNS
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  tracking_url TEXT NOT NULL,
  commission_type TEXT CHECK (commission_type IN ('CPC','CPA','Revenue Share')) NOT NULL,
  commission_value NUMERIC NOT NULL,
  banner_url TEXT,
  status TEXT CHECK (status IN ('active','pending','rejected','paused')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- REFERRALS (unique per affiliate per campaign)
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  ref_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(affiliate_id, campaign_id)
);

-- CLICKS
CREATE TABLE public.clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID REFERENCES public.referrals(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CONVERSIONS
CREATE TABLE public.conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID REFERENCES public.referrals(id) ON DELETE CASCADE,
  revenue NUMERIC DEFAULT 0,
  commission_earned NUMERIC DEFAULT 0,
  conversion_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WALLET TRANSACTIONS
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  type TEXT CHECK (type IN ('commission', 'payout', 'bonus')) DEFAULT 'commission',
  status TEXT CHECK (status IN ('pending','paid','failed')) DEFAULT 'pending',
  payout_method TEXT,
  payout_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BLOG POSTS
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  slug TEXT UNIQUE NOT NULL,
  featured_image TEXT,
  status TEXT CHECK (status IN ('draft','published')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- CAMPAIGNS policies
CREATE POLICY "Anyone can read active campaigns" ON public.campaigns
  FOR SELECT USING (status = 'active');

CREATE POLICY "Advertisers can insert campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (auth.uid() = advertiser_id AND 
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'advertiser'));

CREATE POLICY "Advertisers can update own campaigns" ON public.campaigns
  FOR UPDATE USING (auth.uid() = advertiser_id);

-- REFERRALS policies
CREATE POLICY "Affiliates can read own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = affiliate_id);

CREATE POLICY "Affiliates can create referrals" ON public.referrals
  FOR INSERT WITH CHECK (auth.uid() = affiliate_id AND 
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('affiliate', 'admin')));

-- CLICKS policies
CREATE POLICY "Anyone can insert clicks" ON public.clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Affiliates can read clicks for their referrals" ON public.clicks
  FOR SELECT USING (EXISTS(
    SELECT 1 FROM public.referrals r 
    WHERE r.id = referral_id AND r.affiliate_id = auth.uid()
  ));

-- CONVERSIONS policies
CREATE POLICY "Affiliates can read conversions for their referrals" ON public.conversions
  FOR SELECT USING (EXISTS(
    SELECT 1 FROM public.referrals r 
    WHERE r.id = referral_id AND r.affiliate_id = auth.uid()
  ));

CREATE POLICY "System can insert conversions" ON public.conversions
  FOR INSERT WITH CHECK (true);

-- WALLET policies
CREATE POLICY "Affiliates can read own wallet transactions" ON public.wallet_transactions
  FOR SELECT USING (auth.uid() = affiliate_id);

-- BLOG POSTS policies
CREATE POLICY "Anyone can read published posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can manage own posts" ON public.blog_posts
  FOR ALL USING (auth.uid() = author_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    'affiliate'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate referral codes
CREATE OR REPLACE FUNCTION public.generate_ref_code()
RETURNS TEXT AS $$
BEGIN
  RETURN substring(md5(random()::text) from 1 for 8);
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX idx_campaigns_advertiser ON public.campaigns(advertiser_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_referrals_affiliate ON public.referrals(affiliate_id);
CREATE INDEX idx_referrals_campaign ON public.referrals(campaign_id);
CREATE INDEX idx_clicks_referral ON public.clicks(referral_id);
CREATE INDEX idx_clicks_created_at ON public.clicks(created_at);
CREATE INDEX idx_conversions_referral ON public.conversions(referral_id);
CREATE INDEX idx_wallet_affiliate ON public.wallet_transactions(affiliate_id);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);

-- Insert some seed data for testing
INSERT INTO public.blog_posts (title, content, excerpt, slug, status, author_id) VALUES
('Welcome to AffiliateHub', 'Start your affiliate marketing journey with our comprehensive platform. Learn how to maximize your earnings and grow your network.', 'Get started with affiliate marketing on our platform', 'welcome-to-affiliatehub', 'published', NULL),
('Top 5 Affiliate Marketing Tips', 'Discover the most effective strategies for successful affiliate marketing campaigns.', 'Learn the best practices for affiliate success', 'top-5-affiliate-marketing-tips', 'published', NULL),
('How to Choose the Right Campaigns', 'A comprehensive guide to selecting campaigns that align with your audience and maximize conversions.', 'Choose campaigns that convert better', 'how-to-choose-right-campaigns', 'published', NULL);