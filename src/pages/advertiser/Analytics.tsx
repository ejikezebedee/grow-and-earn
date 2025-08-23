import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, Download, TrendingUp, Users, MousePointer, Target } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Analytics {
  totalCampaigns: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  conversionRate: number;
  topCampaigns: Array<{
    name: string;
    clicks: number;
    conversions: number;
    revenue: number;
  }>;
  topAffiliates: Array<{
    name: string;
    clicks: number;
    conversions: number;
    revenue: number;
  }>;
  dailyStats: Array<{
    date: string;
    clicks: number;
    conversions: number;
    revenue: number;
  }>;
}

export const Analytics = () => {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalCampaigns: 0,
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0,
    conversionRate: 0,
    topCampaigns: [],
    topAffiliates: [],
    dailyStats: []
  });
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  });
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Array<{ id: string; title: string }>>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCampaigns();
      fetchAnalytics();
    }
  }, [user, selectedCampaign, dateRange]);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id, title')
        .eq('advertiser_id', user?.id)
        .eq('status', 'active');

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Build query conditions
      let campaignsQuery = supabase
        .from('campaigns')
        .select(`
          id,
          title,
          referrals!inner(
            id,
            clicks!inner(created_at),
            conversions!inner(created_at, revenue, commission_earned),
            profiles!inner(full_name)
          )
        `)
        .eq('advertiser_id', user?.id);

      if (selectedCampaign !== 'all') {
        campaignsQuery = campaignsQuery.eq('id', selectedCampaign);
      }

      const { data: campaignData, error } = await campaignsQuery;

      if (error) throw error;

      // Process analytics data
      const processedData = {
        totalCampaigns: campaignData?.length || 0,
        totalClicks: 0,
        totalConversions: 0,
        totalRevenue: 0,
        conversionRate: 0,
        topCampaigns: [] as any[],
        topAffiliates: [] as any[],
        dailyStats: [] as any[]
      };

      const campaignStats = new Map();
      const affiliateStats = new Map();
      const dailyStats = new Map();

      campaignData?.forEach(campaign => {
        campaign.referrals.forEach(referral => {
          const campaignKey = campaign.id;
          const affiliateKey = referral.profiles.full_name;

          // Initialize campaign stats
          if (!campaignStats.has(campaignKey)) {
            campaignStats.set(campaignKey, {
              name: campaign.title,
              clicks: 0,
              conversions: 0,
              revenue: 0
            });
          }

          // Initialize affiliate stats
          if (!affiliateStats.has(affiliateKey)) {
            affiliateStats.set(affiliateKey, {
              name: affiliateKey,
              clicks: 0,
              conversions: 0,
              revenue: 0
            });
          }

          // Process clicks
          referral.clicks.forEach(click => {
            const clickDate = new Date(click.created_at);
            if (clickDate >= dateRange.from && clickDate <= dateRange.to) {
              processedData.totalClicks++;
              campaignStats.get(campaignKey).clicks++;
              affiliateStats.get(affiliateKey).clicks++;

              // Daily stats
              const dayKey = format(clickDate, 'yyyy-MM-dd');
              if (!dailyStats.has(dayKey)) {
                dailyStats.set(dayKey, { date: dayKey, clicks: 0, conversions: 0, revenue: 0 });
              }
              dailyStats.get(dayKey).clicks++;
            }
          });

          // Process conversions
          referral.conversions.forEach(conversion => {
            const conversionDate = new Date(conversion.created_at);
            if (conversionDate >= dateRange.from && conversionDate <= dateRange.to) {
              processedData.totalConversions++;
              processedData.totalRevenue += conversion.revenue || 0;

              campaignStats.get(campaignKey).conversions++;
              campaignStats.get(campaignKey).revenue += conversion.revenue || 0;

              affiliateStats.get(affiliateKey).conversions++;
              affiliateStats.get(affiliateKey).revenue += conversion.revenue || 0;

              // Daily stats
              const dayKey = format(conversionDate, 'yyyy-MM-dd');
              if (!dailyStats.has(dayKey)) {
                dailyStats.set(dayKey, { date: dayKey, clicks: 0, conversions: 0, revenue: 0 });
              }
              dailyStats.get(dayKey).conversions++;
              dailyStats.get(dayKey).revenue += conversion.revenue || 0;
            }
          });
        });
      });

      // Calculate conversion rate
      processedData.conversionRate = processedData.totalClicks > 0 
        ? (processedData.totalConversions / processedData.totalClicks) * 100 
        : 0;

      // Sort and get top campaigns and affiliates
      processedData.topCampaigns = Array.from(campaignStats.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      processedData.topAffiliates = Array.from(affiliateStats.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Sort daily stats
      processedData.dailyStats = Array.from(dailyStats.values())
        .sort((a, b) => a.date.localeCompare(b.date));

      setAnalytics(processedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    // Create CSV data
    const csvData = analytics.dailyStats.map(day => ({
      Date: day.date,
      Clicks: day.clicks,
      Conversions: day.conversions,
      Revenue: day.revenue.toFixed(2),
      'Conversion Rate': ((day.conversions / day.clicks) * 100 || 0).toFixed(2) + '%'
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your campaign performance and affiliate activities
          </p>
        </div>
        <Button onClick={exportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign</label>
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  {campaigns.map((campaign) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "PPP") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => date && setDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[140px] justify-start text-left font-normal",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "PPP") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => date && setDateRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalConversions.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance Over Time */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>Daily clicks, conversions, and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#8884d8" name="Clicks" />
                <Line yAxisId="left" type="monotone" dataKey="conversions" stroke="#82ca9d" name="Conversions" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#ffc658" name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Top Campaigns</CardTitle>
            <CardDescription>Best performing campaigns by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topCampaigns.map((campaign, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {campaign.clicks} clicks • {campaign.conversions} conversions
                    </p>
                  </div>
                  <Badge variant="outline">${campaign.revenue.toFixed(2)}</Badge>
                </div>
              ))}
              {analytics.topCampaigns.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No campaign data available for the selected period
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Affiliates */}
        <Card>
          <CardHeader>
            <CardTitle>Top Affiliates</CardTitle>
            <CardDescription>Best performing affiliates by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topAffiliates.map((affiliate, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{affiliate.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {affiliate.clicks} clicks • {affiliate.conversions} conversions
                    </p>
                  </div>
                  <Badge variant="outline">${affiliate.revenue.toFixed(2)}</Badge>
                </div>
              ))}
              {analytics.topAffiliates.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No affiliate data available for the selected period
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};