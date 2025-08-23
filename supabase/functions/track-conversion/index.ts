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

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { refCode, revenue = 0, conversionData = {} } = await req.json();
    
    if (!refCode) {
      return new Response(
        JSON.stringify({ error: 'Referral code is required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Tracking conversion for ref code: ${refCode}`);

    // Find the referral with campaign details
    const { data: referralData, error: refError } = await supabase
      .from('referrals')
      .select(`
        *,
        campaigns!inner(commission_type, commission_value),
        profiles!inner(id)
      `)
      .eq('ref_code', refCode)
      .single();

    if (refError || !referralData) {
      console.error('Referral not found:', refError);
      return new Response(
        JSON.stringify({ error: 'Invalid referral code' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const campaign = referralData.campaigns;
    let commissionEarned = 0;

    // Calculate commission based on type
    if (campaign.commission_type === 'CPA') {
      commissionEarned = campaign.commission_value;
    } else if (campaign.commission_type === 'Revenue Share') {
      commissionEarned = (revenue * campaign.commission_value) / 100;
    } else if (campaign.commission_type === 'CPC') {
      commissionEarned = campaign.commission_value;
    }

    // Insert conversion record
    const { error: conversionError } = await supabase
      .from('conversions')
      .insert({
        referral_id: referralData.id,
        revenue,
        commission_earned: commissionEarned,
        conversion_data: conversionData
      });

    if (conversionError) {
      console.error('Error inserting conversion:', conversionError);
      return new Response(
        JSON.stringify({ error: 'Failed to track conversion' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add to affiliate wallet
    const { error: walletError } = await supabase
      .from('wallet_transactions')
      .insert({
        affiliate_id: referralData.affiliate_id,
        amount: commissionEarned,
        type: 'commission'
      });

    if (walletError) {
      console.error('Error updating wallet:', walletError);
      return new Response(
        JSON.stringify({ error: 'Failed to update wallet' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Conversion tracked successfully: ${commissionEarned} earned for affiliate ${referralData.affiliate_id}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        commissionEarned,
        message: 'Conversion tracked successfully' 
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in track-conversion function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});