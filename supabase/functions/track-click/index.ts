import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const refCode = url.pathname.split('/').pop();
    
    if (!refCode) {
      return new Response(
        JSON.stringify({ error: 'Referral code is required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client IP and user agent
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Tracking click for ref code: ${refCode}`);

    // Find the referral
    const { data: referral, error: refError } = await supabase
      .from('referrals')
      .select('*')
      .eq('ref_code', refCode)
      .single();

    if (refError || !referral) {
      console.error('Referral not found:', refError);
      return new Response(
        JSON.stringify({ error: 'Invalid referral code' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert click record
    const { error: clickError } = await supabase
      .from('clicks')
      .insert({
        referral_id: referral.id,
        ip_address: ipAddress,
        user_agent: userAgent
      });

    if (clickError) {
      console.error('Error inserting click:', clickError);
      return new Response(
        JSON.stringify({ error: 'Failed to track click' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get campaign details for redirect
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('tracking_url')
      .eq('id', referral.campaign_id)
      .single();

    const redirectUrl = campaign?.tracking_url || 'https://example.com';
    
    console.log(`Click tracked successfully for referral ${referral.id}, redirecting to ${redirectUrl}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        redirectUrl,
        message: 'Click tracked successfully' 
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in track-click function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});