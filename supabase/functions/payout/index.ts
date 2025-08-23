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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Set the auth header for the request
    supabase.rest.headers = { ...supabase.rest.headers, Authorization: authHeader };

    // Verify user is admin
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }), 
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { affiliateId, amount, method = 'paypal' } = await req.json();
    
    if (!affiliateId || !amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid payout parameters' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing payout: ${amount} to affiliate ${affiliateId} via ${method}`);

    // Get affiliate wallet address
    const { data: affiliate, error: affiliateError } = await supabase
      .from('profiles')
      .select('wallet_address, full_name')
      .eq('id', affiliateId)
      .single();

    if (affiliateError || !affiliate) {
      return new Response(
        JSON.stringify({ error: 'Affiliate not found' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For PayPal integration, you would implement the PayPal API calls here
    // For now, we'll simulate a successful payout
    const payoutId = `payout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate PayPal API call (replace with actual implementation)
    const paypalSuccess = true; // This would be the result of the PayPal API call
    
    if (paypalSuccess) {
      // Record successful payout
      const { error: payoutError } = await supabase
        .from('wallet_transactions')
        .insert({
          affiliate_id: affiliateId,
          amount: -amount, // Negative for payout
          type: 'payout',
          status: 'paid',
          payout_method: method,
          payout_details: {
            payout_id: payoutId,
            wallet_address: affiliate.wallet_address,
            processed_at: new Date().toISOString()
          }
        });

      if (payoutError) {
        console.error('Error recording payout:', payoutError);
        return new Response(
          JSON.stringify({ error: 'Failed to record payout' }), 
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Payout processed successfully: ${payoutId}`);

      return new Response(
        JSON.stringify({ 
          success: true,
          payoutId,
          message: 'Payout processed successfully' 
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Record failed payout
      const { error: payoutError } = await supabase
        .from('wallet_transactions')
        .insert({
          affiliate_id: affiliateId,
          amount: -amount,
          type: 'payout',
          status: 'failed',
          payout_method: method,
          payout_details: {
            error: 'PayPal API error',
            attempted_at: new Date().toISOString()
          }
        });

      return new Response(
        JSON.stringify({ error: 'Payout failed' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in payout function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});