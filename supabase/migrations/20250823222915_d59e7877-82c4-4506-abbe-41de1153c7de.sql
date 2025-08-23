-- Create storage bucket for campaign banners
INSERT INTO storage.buckets (id, name, public) VALUES ('campaign-banners', 'campaign-banners', true);

-- Create storage policies for campaign banners
CREATE POLICY "Campaign banners are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'campaign-banners');

CREATE POLICY "Advertisers can upload campaign banners" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'campaign-banners' AND auth.uid() IS NOT NULL);

CREATE POLICY "Advertisers can update their campaign banners" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'campaign-banners' AND auth.uid() IS NOT NULL);

CREATE POLICY "Advertisers can delete their campaign banners" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'campaign-banners' AND auth.uid() IS NOT NULL);

-- Add additional fields to campaigns table for better management
ALTER TABLE public.campaigns 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.profiles(id);

-- Create user suspensions table
CREATE TABLE public.user_suspensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  suspended_by UUID REFERENCES public.profiles(id),
  reason TEXT NOT NULL,
  suspended_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lifted_at TIMESTAMP WITH TIME ZONE,
  lifted_by UUID REFERENCES public.profiles(id),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create fraud detection table
CREATE TABLE public.fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'suspicious_clicks', 'unusual_conversions', etc.
  entity_type TEXT NOT NULL, -- 'user', 'campaign', 'referral'
  entity_id UUID NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  description TEXT NOT NULL,
  data JSONB,
  status TEXT CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES public.profiles(id)
);

-- Create payout requests table
CREATE TABLE public.payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  method TEXT DEFAULT 'paypal',
  payout_details JSONB, -- email, wallet address, etc.
  status TEXT CHECK (status IN ('pending', 'approved', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES public.profiles(id),
  transaction_id TEXT -- external payout system reference
);

-- Enable RLS on new tables
ALTER TABLE public.user_suspensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

-- Policies for user_suspensions
CREATE POLICY "Admins can manage suspensions" ON public.user_suspensions
  FOR ALL USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policies for fraud_alerts  
CREATE POLICY "Admins can manage fraud alerts" ON public.fraud_alerts
  FOR ALL USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policies for payout_requests
CREATE POLICY "Affiliates can read own payout requests" ON public.payout_requests
  FOR SELECT USING (auth.uid() = affiliate_id);

CREATE POLICY "Affiliates can create payout requests" ON public.payout_requests
  FOR INSERT WITH CHECK (auth.uid() = affiliate_id AND 
    EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'affiliate'));

CREATE POLICY "Admins can manage payout requests" ON public.payout_requests
  FOR ALL USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create indexes for performance
CREATE INDEX idx_user_suspensions_user ON public.user_suspensions(user_id);
CREATE INDEX idx_user_suspensions_active ON public.user_suspensions(is_active);
CREATE INDEX idx_fraud_alerts_type ON public.fraud_alerts(type);
CREATE INDEX idx_fraud_alerts_status ON public.fraud_alerts(status);
CREATE INDEX idx_fraud_alerts_entity ON public.fraud_alerts(entity_type, entity_id);
CREATE INDEX idx_payout_requests_affiliate ON public.payout_requests(affiliate_id);
CREATE INDEX idx_payout_requests_status ON public.payout_requests(status);

-- Update campaigns policies for admin management
CREATE POLICY "Admins can manage all campaigns" ON public.campaigns
  FOR ALL USING (EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Function to check if user is suspended
CREATE OR REPLACE FUNCTION public.is_user_suspended(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_suspensions
    WHERE user_suspensions.user_id = is_user_suspended.user_id
    AND is_active = TRUE
    AND lifted_at IS NULL
  );
$$;

-- Function to detect fraud patterns
CREATE OR REPLACE FUNCTION public.detect_suspicious_clicks()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert fraud alerts for multiple clicks from same IP within 1 hour
  INSERT INTO public.fraud_alerts (type, entity_type, entity_id, description, data)
  SELECT 
    'suspicious_clicks',
    'referral',
    referral_id,
    'Multiple clicks from same IP within 1 hour: ' || ip_address,
    jsonb_build_object('ip_address', ip_address, 'click_count', click_count, 'time_window', '1 hour')
  FROM (
    SELECT 
      referral_id,
      ip_address,
      COUNT(*) as click_count
    FROM public.clicks
    WHERE created_at > NOW() - INTERVAL '1 hour'
    GROUP BY referral_id, ip_address
    HAVING COUNT(*) > 10
  ) suspicious_activity
  ON CONFLICT DO NOTHING;
END;
$$;