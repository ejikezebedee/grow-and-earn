import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Users, TrendingUp, Eye, MousePointer, Target } from 'lucide-react';

interface Stats {
  totalEarnings: number;
  totalClicks: number;
  totalConversions: number;
  activeCampaigns: number;
  pendingPayouts: number;
  conversionRate: number;
}

export const Overview = () => {
  const [stats, setStats] = useState<Stats>({
    totalEarnings: 0,
    totalClicks: 0,
    totalConversions: 0,
    activeCampaigns: 0,
    pendingPayouts: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const { profile, user } = useAuth();

  useEffect(() => {
    if (user && profile) {
      fetchStats();
    }
  }, [user, profile]);

  const fetchStats = async () => {
    try {
      if (profile?.role === 'affiliate') {
        await fetchAffiliateStats();
      } else if (profile?.role === 'advertiser') {
        await fetchAdvertiserStats();
      } else if (profile?.role === 'admin') {
        await fetchAdminStats();
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAffiliateStats = async () => {
    // Get affiliate referrals
    const { data: referrals } = await supabase
      .from('referrals')
      .select(`
        *,
        clicks(count),
        conversions(count, commission_earned)
      `)
      .eq('affiliate_id', user?.id);

    // Get wallet balance
    const { data: walletTransactions } = await supabase
      .from('wallet_transactions')
      .select('amount, status')
      .eq('affiliate_id', user?.id);

    // Get active campaigns count
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id')
      .eq('status', 'active');

    let totalEarnings = 0;
    let pendingPayouts = 0;
    let totalClicks = 0;
    let totalConversions = 0;

    walletTransactions?.forEach(transaction => {
      if (transaction.status === 'paid') {
        totalEarnings += transaction.amount;
      } else if (transaction.status === 'pending' && transaction.amount > 0) {
        pendingPayouts += transaction.amount;
      }
    });

    referrals?.forEach(referral => {
      totalClicks += referral.clicks?.[0]?.count || 0;
      totalConversions += referral.conversions?.[0]?.count || 0;
    });

    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    setStats({
      totalEarnings,
      totalClicks,
      totalConversions,
      activeCampaigns: campaigns?.length || 0,
      pendingPayouts,
      conversionRate
    });
  };

  const fetchAdvertiserStats = async () => {
    // Get advertiser campaigns
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select(`
        *,
        referrals(
          *,
          clicks(count),
          conversions(count, revenue)
        )
      `)
      .eq('advertiser_id', user?.id);

    let totalSpent = 0;
    let totalClicks = 0;
    let totalConversions = 0;
    let totalRevenue = 0;

    campaigns?.forEach(campaign => {
      campaign.referrals?.forEach(referral => {
        totalClicks += referral.clicks?.[0]?.count || 0;
        totalConversions += referral.conversions?.[0]?.count || 0;
        totalRevenue += referral.conversions?.[0]?.revenue || 0;
      });
    });

    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    setStats({
      totalEarnings: totalRevenue,
      totalClicks,
      totalConversions,
      activeCampaigns: campaigns?.filter(c => c.status === 'active').length || 0,
      pendingPayouts: totalSpent,
      conversionRate
    });
  };

  const fetchAdminStats = async () => {
    // Get total platform stats
    const { data: allClicks } = await supabase
      .from('clicks')
      .select('id');

    const { data: allConversions } = await supabase
      .from('conversions')
      .select('commission_earned, revenue');

    const { data: allCampaigns } = await supabase
      .from('campaigns')
      .select('id, status');

    const { data: pendingPayouts } = await supabase
      .from('wallet_transactions')
      .select('amount')
      .eq('status', 'pending')
      .gt('amount', 0);

    const totalClicks = allClicks?.length || 0;
    const totalConversions = allConversions?.length || 0;
    const totalRevenue = allConversions?.reduce((sum, c) => sum + (c.revenue || 0), 0) || 0;
    const totalCommissions = allConversions?.reduce((sum, c) => sum + (c.commission_earned || 0), 0) || 0;
    const pendingAmount = pendingPayouts?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    setStats({
      totalEarnings: totalRevenue,
      totalClicks,
      totalConversions,
      activeCampaigns: allCampaigns?.filter(c => c.status === 'active').length || 0,
      pendingPayouts: pendingAmount,
      conversionRate
    });
  };

  const getStatsCards = () => {
    if (profile?.role === 'affiliate') {
      return [
        {
          title: 'Total Earnings',
          value: `$${stats.totalEarnings.toFixed(2)}`,
          description: 'Lifetime commissions earned',
          icon: DollarSign,
          color: 'text-success'
        },
        {
          title: 'Pending Payouts',
          value: `$${stats.pendingPayouts.toFixed(2)}`,
          description: 'Awaiting payment',
          icon: TrendingUp,
          color: 'text-warning'
        },
        {
          title: 'Total Clicks',
          value: stats.totalClicks.toLocaleString(),
          description: 'Clicks on your referral links',
          icon: MousePointer,
          color: 'text-info'
        },
        {
          title: 'Conversions',
          value: stats.totalConversions.toLocaleString(),
          description: `${stats.conversionRate.toFixed(1)}% conversion rate`,
          icon: Target,
          color: 'text-accent'
        }
      ];
    }

    if (profile?.role === 'advertiser') {
      return [
        {
          title: 'Total Revenue',
          value: `$${stats.totalEarnings.toFixed(2)}`,
          description: 'Revenue from campaigns',
          icon: DollarSign,
          color: 'text-success'
        },
        {
          title: 'Active Campaigns',
          value: stats.activeCampaigns.toString(),
          description: 'Currently running campaigns',
          icon: TrendingUp,
          color: 'text-primary'
        },
        {
          title: 'Total Clicks',
          value: stats.totalClicks.toLocaleString(),
          description: 'Clicks across all campaigns',
          icon: Eye,
          color: 'text-info'
        },
        {
          title: 'Conversions',
          value: stats.totalConversions.toLocaleString(),
          description: `${stats.conversionRate.toFixed(1)}% conversion rate`,
          icon: Target,
          color: 'text-accent'
        }
      ];
    }

    if (profile?.role === 'admin') {
      return [
        {
          title: 'Platform Revenue',
          value: `$${stats.totalEarnings.toFixed(2)}`,
          description: 'Total platform revenue',
          icon: DollarSign,
          color: 'text-success'
        },
        {
          title: 'Pending Payouts',
          value: `$${stats.pendingPayouts.toFixed(2)}`,
          description: 'Payouts awaiting processing',
          icon: TrendingUp,
          color: 'text-warning'
        },
        {
          title: 'Total Clicks',
          value: stats.totalClicks.toLocaleString(),
          description: 'Platform-wide clicks',
          icon: Eye,
          color: 'text-info'
        },
        {
          title: 'Active Campaigns',
          value: stats.activeCampaigns.toString(),
          description: 'Currently active campaigns',
          icon: Users,
          color: 'text-primary'
        }
      ];
    }

    return [];
  };

  const statsCards = getStatsCards();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.full_name}! Here's your {profile?.role} overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="shadow-card hover:shadow-elegant transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with these common tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {profile?.role === 'affiliate' && (
            <>
              <Card className="p-4 hover:shadow-sm transition-shadow cursor-pointer">
                <h3 className="font-semibold mb-2">Browse Campaigns</h3>
                <p className="text-sm text-muted-foreground">Find new campaigns to join and start earning</p>
              </Card>
              <Card className="p-4 hover:shadow-sm transition-shadow cursor-pointer">
                <h3 className="font-semibold mb-2">Check Wallet</h3>
                <p className="text-sm text-muted-foreground">View your earnings and request payouts</p>
              </Card>
            </>
          )}
          {profile?.role === 'advertiser' && (
            <>
              <Card className="p-4 hover:shadow-sm transition-shadow cursor-pointer">
                <h3 className="font-semibold mb-2">Create Campaign</h3>
                <p className="text-sm text-muted-foreground">Launch a new affiliate marketing campaign</p>
              </Card>
              <Card className="p-4 hover:shadow-sm transition-shadow cursor-pointer">
                <h3 className="font-semibold mb-2">View Analytics</h3>
                <p className="text-sm text-muted-foreground">Analyze your campaign performance</p>
              </Card>
            </>
          )}
          {profile?.role === 'admin' && (
            <>
              <Card className="p-4 hover:shadow-sm transition-shadow cursor-pointer">
                <h3 className="font-semibold mb-2">Review Campaigns</h3>
                <p className="text-sm text-muted-foreground">Approve pending campaign submissions</p>
              </Card>
              <Card className="p-4 hover:shadow-sm transition-shadow cursor-pointer">
                <h3 className="font-semibold mb-2">Process Payouts</h3>
                <p className="text-sm text-muted-foreground">Handle affiliate payout requests</p>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};