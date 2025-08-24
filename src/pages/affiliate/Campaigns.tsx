import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, ExternalLink, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Campaign {
  id: string;
  title: string;
  description: string;
  commission_type: string;
  commission_value: number;
  banner_url?: string;
  tracking_url: string;
}

interface Referral {
  id: string;
  ref_code: string;
  campaign_id: string;
}

export const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCampaigns();
      fetchReferrals();
    }
  }, [user]);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('affiliate_id', user?.id);

      if (error) throw error;
      setReferrals(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      setLoading(false);
    }
  };

  const joinCampaign = async (campaignId: string) => {
    try {
      // Use the database function to generate referral code
      const { data: refCodeData } = await supabase.rpc('generate_ref_code');
      const refCode = refCodeData || Math.random().toString(36).substr(2, 8);
      
      const { error } = await supabase
        .from('referrals')
        .insert({
          affiliate_id: user?.id,
          campaign_id: campaignId,
          ref_code: refCode
        });

      if (error) throw error;

      toast({
        title: "Campaign Joined!",
        description: "You've successfully joined this campaign. Your referral link is ready.",
      });

      fetchReferrals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join campaign",
        variant: "destructive",
      });
    }
  };

  const copyReferralLink = (refCode: string) => {
    const link = `${window.location.origin}/ref/${refCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard.",
    });
  };

  const isJoined = (campaignId: string) => {
    return referrals.some(ref => ref.campaign_id === campaignId);
  };

  const getReferralCode = (campaignId: string) => {
    return referrals.find(ref => ref.campaign_id === campaignId)?.ref_code;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Available Campaigns</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="h-8 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Available Campaigns</h1>
        <p className="text-muted-foreground">
          Join campaigns and start earning commissions from your referrals.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => {
          const joined = isJoined(campaign.id);
          const refCode = getReferralCode(campaign.id);
          
          return (
            <Card key={campaign.id} className="shadow-card hover:shadow-elegant transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{campaign.title}</CardTitle>
                    <Badge variant="secondary" className="w-fit">
                      {campaign.commission_type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-success">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-bold">
                        {campaign.commission_type === 'Revenue Share' 
                          ? `${campaign.commission_value}%`
                          : `$${campaign.commission_value}`
                        }
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">per {campaign.commission_type}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-3">
                  {campaign.description}
                </CardDescription>

                {campaign.banner_url && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={campaign.banner_url} 
                      alt={campaign.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}

                {joined ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                      <span className="text-sm font-medium text-success">Joined Campaign</span>
                      <Users className="h-4 w-4 text-success" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Your Referral Link:</label>
                      <div className="flex gap-2">
                        <code className="flex-1 p-2 bg-muted rounded text-xs break-all">
                          {window.location.origin}/ref/{refCode}
                        </code>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyReferralLink(refCode!)}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      asChild
                    >
                      <a href={campaign.tracking_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Campaign
                      </a>
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={() => joinCampaign(campaign.id)}
                  >
                    Join Campaign
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {campaigns.length === 0 && (
        <Card className="p-8 text-center">
          <CardTitle className="mb-2">No Active Campaigns</CardTitle>
          <CardDescription>
            There are no active campaigns available right now. Check back later!
          </CardDescription>
        </Card>
      )}
    </div>
  );
};