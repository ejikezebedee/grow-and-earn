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

    console.log('Running fraud detection analysis...');

    const alerts = [];
    const timeWindowHours = 24;

    // 1. Detect suspicious click patterns (multiple clicks from same IP)
    const { data: suspiciousClicks, error: clickError } = await supabase
      .from('clicks')
      .select(`
        referral_id,
        ip_address,
        referrals!inner(
          affiliate_id,
          profiles!inner(full_name)
        )
      `)
      .gte('created_at', new Date(Date.now() - timeWindowHours * 60 * 60 * 1000).toISOString());

    if (!clickError && suspiciousClicks) {
      const ipClickCounts = new Map();
      
      suspiciousClicks.forEach(click => {
        const key = `${click.ip_address}-${click.referral_id}`;
        if (!ipClickCounts.has(key)) {
          ipClickCounts.set(key, { 
            count: 0, 
            referral_id: click.referral_id,
            ip_address: click.ip_address,
            affiliate: click.referrals.profiles.full_name
          });
        }
        ipClickCounts.get(key).count++;
      });

      for (const [key, data] of ipClickCounts) {
        if (data.count > 10) { // Suspicious if more than 10 clicks from same IP
          alerts.push({
            type: 'suspicious_clicks',
            entity_type: 'referral',
            entity_id: data.referral_id,
            severity: data.count > 50 ? 'critical' : data.count > 25 ? 'high' : 'medium',
            description: `${data.count} clicks from IP ${data.ip_address} in ${timeWindowHours}h (Affiliate: ${data.affiliate})`,
            data: {
              ip_address: data.ip_address,
              click_count: data.count,
              time_window: `${timeWindowHours}h`,
              affiliate: data.affiliate
            }
          });
        }
      }
    }

    // 2. Detect unusual conversion rates
    const { data: conversionData, error: conversionError } = await supabase
      .from('referrals')
      .select(`
        id,
        affiliate_id,
        profiles!inner(full_name),
        clicks(count),
        conversions(count)
      `);

    if (!conversionError && conversionData) {
      conversionData.forEach(referral => {
        const clickCount = referral.clicks?.[0]?.count || 0;
        const conversionCount = referral.conversions?.[0]?.count || 0;
        
        if (clickCount > 0) {
          const conversionRate = (conversionCount / clickCount) * 100;
          
          // Flag if conversion rate is suspiciously high (>50%) with significant volume
          if (conversionRate > 50 && clickCount > 20) {
            alerts.push({
              type: 'unusual_conversions',
              entity_type: 'referral',
              entity_id: referral.id,
              severity: conversionRate > 80 ? 'critical' : 'high',
              description: `Unusually high conversion rate: ${conversionRate.toFixed(1)}% (${conversionCount}/${clickCount}) for ${referral.profiles.full_name}`,
              data: {
                conversion_rate: conversionRate,
                clicks: clickCount,
                conversions: conversionCount,
                affiliate: referral.profiles.full_name
              }
            });
          }
        }
      });
    }

    // 3. Detect rapid-fire clicks (same user agent, short time spans)
    const { data: rapidClicks, error: rapidError } = await supabase
      .from('clicks')
      .select(`
        referral_id,
        user_agent,
        created_at,
        referrals!inner(
          affiliate_id,
          profiles!inner(full_name)
        )
      `)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
      .order('created_at', { ascending: true });

    if (!rapidError && rapidClicks) {
      const userAgentGroups = new Map();
      
      rapidClicks.forEach(click => {
        const key = `${click.user_agent}-${click.referral_id}`;
        if (!userAgentGroups.has(key)) {
          userAgentGroups.set(key, []);
        }
        userAgentGroups.get(key).push(click);
      });

      for (const [key, clicks] of userAgentGroups) {
        if (clicks.length > 5) { // More than 5 clicks with same user agent in 1 hour
          // Check if clicks are very close together (within 5 minutes)
          let rapidClickCount = 0;
          for (let i = 1; i < clicks.length; i++) {
            const timeDiff = new Date(clicks[i].created_at).getTime() - new Date(clicks[i-1].created_at).getTime();
            if (timeDiff < 5 * 60 * 1000) { // 5 minutes
              rapidClickCount++;
            }
          }

          if (rapidClickCount > 3) {
            alerts.push({
              type: 'rapid_clicks',
              entity_type: 'referral',
              entity_id: clicks[0].referral_id,
              severity: rapidClickCount > 10 ? 'critical' : 'medium',
              description: `${rapidClickCount} rapid clicks detected from same user agent in 1h (Affiliate: ${clicks[0].referrals.profiles.full_name})`,
              data: {
                rapid_click_count: rapidClickCount,
                total_clicks: clicks.length,
                time_window: '1h',
                affiliate: clicks[0].referrals.profiles.full_name,
                user_agent: clicks[0].user_agent.substring(0, 100) // Truncate for storage
              }
            });
          }
        }
      }
    }

    // Insert all detected alerts into the database
    if (alerts.length > 0) {
      const { error: insertError } = await supabase
        .from('fraud_alerts')
        .insert(alerts);

      if (insertError) {
        console.error('Error inserting fraud alerts:', insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to save fraud alerts' }), 
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log(`Fraud detection completed: ${alerts.length} alerts generated`);

    return new Response(
      JSON.stringify({ 
        success: true,
        alertsGenerated: alerts.length,
        alerts: alerts.map(alert => ({
          type: alert.type,
          severity: alert.severity,
          description: alert.description
        })),
        message: `Fraud detection completed: ${alerts.length} alerts generated` 
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in detect-fraud function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});