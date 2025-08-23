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

    const { userId, action, newRole, suspensionReason } = await req.json();
    
    if (!userId || !action || !['change_role', 'suspend', 'unsuspend'].includes(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid parameters' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Admin ${user.id} performing ${action} on user ${userId}`);

    if (action === 'change_role') {
      if (!newRole || !['affiliate', 'advertiser', 'admin'].includes(newRole)) {
        return new Response(
          JSON.stringify({ error: 'Invalid role' }), 
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (roleError) {
        console.error('Error updating user role:', roleError);
        return new Response(
          JSON.stringify({ error: 'Failed to update user role' }), 
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`User ${userId} role changed to ${newRole}`);

      return new Response(
        JSON.stringify({ 
          success: true,
          message: `User role changed to ${newRole}` 
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'suspend') {
      if (!suspensionReason) {
        return new Response(
          JSON.stringify({ error: 'Suspension reason required' }), 
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { error: suspendError } = await supabase
        .from('user_suspensions')
        .insert({
          user_id: userId,
          suspended_by: user.id,
          reason: suspensionReason
        });

      if (suspendError) {
        console.error('Error suspending user:', suspendError);
        return new Response(
          JSON.stringify({ error: 'Failed to suspend user' }), 
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`User ${userId} suspended by admin ${user.id}`);

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'User suspended successfully' 
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'unsuspend') {
      const { error: unsuspendError } = await supabase
        .from('user_suspensions')
        .update({
          is_active: false,
          lifted_at: new Date().toISOString(),
          lifted_by: user.id
        })
        .eq('user_id', userId)
        .eq('is_active', true);

      if (unsuspendError) {
        console.error('Error unsuspending user:', unsuspendError);
        return new Response(
          JSON.stringify({ error: 'Failed to unsuspend user' }), 
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`User ${userId} unsuspended by admin ${user.id}`);

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'User unsuspended successfully' 
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in manage-user-role function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});