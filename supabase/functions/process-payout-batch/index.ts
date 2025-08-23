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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

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

    const { payoutRequestIds } = await req.json();
    
    if (!payoutRequestIds || !Array.isArray(payoutRequestIds) || payoutRequestIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid payout request IDs' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${payoutRequestIds.length} payout requests by admin ${user.id}`);

    // Get payout requests
    const { data: payoutRequests, error: fetchError } = await supabase
      .from('payout_requests')
      .select(`
        *,
        profiles!inner(full_name, wallet_address)
      `)
      .in('id', payoutRequestIds)
      .eq('status', 'pending');

    if (fetchError) {
      console.error('Error fetching payout requests:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch payout requests' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!payoutRequests || payoutRequests.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid pending payout requests found' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const processedPayouts = [];
    const failedPayouts = [];

    // Process each payout
    for (const payout of payoutRequests) {
      try {
        // Simulate PayPal API call (replace with actual PayPal integration)
        const payoutId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const paypalSuccess = true; // This would be the result of the PayPal API call

        if (paypalSuccess) {
          // Update payout request status
          const { error: updateError } = await supabase
            .from('payout_requests')
            .update({
              status: 'completed',
              processed_at: new Date().toISOString(),
              processed_by: user.id,
              transaction_id: payoutId
            })
            .eq('id', payout.id);

          if (updateError) {
            console.error(`Error updating payout ${payout.id}:`, updateError);
            failedPayouts.push({ id: payout.id, error: 'Database update failed' });
            continue;
          }

          // Record payout in wallet transactions
          const { error: walletError } = await supabase
            .from('wallet_transactions')
            .insert({
              affiliate_id: payout.affiliate_id,
              amount: -payout.amount, // Negative for payout
              type: 'payout',
              status: 'paid',
              payout_method: payout.method,
              payout_details: {
                payout_request_id: payout.id,
                transaction_id: payoutId,
                processed_at: new Date().toISOString()
              }
            });

          if (walletError) {
            console.error(`Error recording wallet transaction for payout ${payout.id}:`, walletError);
            // Note: We might want to implement compensation logic here
          }

          processedPayouts.push({
            id: payout.id,
            amount: payout.amount,
            affiliate: payout.profiles.full_name,
            transaction_id: payoutId
          });

          console.log(`Payout ${payout.id} processed successfully: ${payoutId}`);
        } else {
          // Handle PayPal API failure
          const { error: failError } = await supabase
            .from('payout_requests')
            .update({
              status: 'failed',
              processed_at: new Date().toISOString(),
              processed_by: user.id
            })
            .eq('id', payout.id);

          if (failError) {
            console.error(`Error updating failed payout ${payout.id}:`, failError);
          }

          failedPayouts.push({ id: payout.id, error: 'PayPal API error' });
        }
      } catch (error) {
        console.error(`Error processing payout ${payout.id}:`, error);
        failedPayouts.push({ id: payout.id, error: error.message });
      }
    }

    const summary = {
      total: payoutRequests.length,
      processed: processedPayouts.length,
      failed: failedPayouts.length,
      processedPayouts,
      failedPayouts
    };

    console.log(`Batch payout processing completed:`, summary);

    return new Response(
      JSON.stringify({ 
        success: true,
        summary,
        message: `Processed ${processedPayouts.length} of ${payoutRequests.length} payouts successfully` 
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-payout-batch function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});