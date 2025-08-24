-- Fix critical security vulnerabilities found in security scan

-- 1. Secure clicks table - only allow INSERT from authenticated system/edge functions
-- Remove the overly permissive policy
DROP POLICY IF EXISTS "Anyone can insert clicks" ON public.clicks;

-- Create secure policy for clicks - only service role can insert
CREATE POLICY "System can insert clicks" 
ON public.clicks 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- 2. Secure conversions table - the existing policy is already correct but let's ensure it's properly named
-- Remove any overly permissive policies if they exist
DROP POLICY IF EXISTS "Anyone can insert conversions" ON public.conversions;

-- Ensure only system/service role can insert conversions
CREATE POLICY "System can insert conversions" 
ON public.conversions 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- 3. Add performance indexes for frequently queried columns
-- Index for referral lookups by ref_code (used in tracking)
CREATE INDEX IF NOT EXISTS idx_referrals_ref_code ON public.referrals(ref_code);

-- Index for clicks by referral_id (used in analytics)
CREATE INDEX IF NOT EXISTS idx_clicks_referral_id ON public.clicks(referral_id);
CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON public.clicks(created_at);

-- Index for conversions by referral_id (used in analytics)
CREATE INDEX IF NOT EXISTS idx_conversions_referral_id ON public.conversions(referral_id);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON public.conversions(created_at);

-- Index for campaigns by status and advertiser
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_advertiser_id ON public.campaigns(advertiser_id);

-- Index for fraud alerts by status and created_at
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_status ON public.fraud_alerts(status);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_created_at ON public.fraud_alerts(created_at);

-- Index for payout requests by affiliate and status
CREATE INDEX IF NOT EXISTS idx_payout_requests_affiliate_id ON public.payout_requests(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_payout_requests_status ON public.payout_requests(status);

-- Index for wallet transactions by affiliate
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_affiliate_id ON public.wallet_transactions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON public.wallet_transactions(created_at);