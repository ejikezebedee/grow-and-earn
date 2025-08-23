import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Copy, BarChart3 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';

interface Referral {
  id: string;
  ref_code: string;
  created_at: string;
  campaigns: {
    title: string;
    commission_type: string;
    commission_value: number;
    status: string;
  };
  _count: {
    clicks: number;
    conversions: number;
  };
  _earnings: number;
}

export const Referrals = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchReferrals();
    }
  }, [user]);

  const fetchReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          campaigns!inner(title, commission_type, commission_value, status),
          clicks(count),
          conversions(count, commission_earned)
        `)
        .eq('affiliate_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedData = data?.map(referral => ({
        ...referral,
        _count: {
          clicks: referral.clicks?.length || 0,
          conversions: referral.conversions?.length || 0
        },
        _earnings: referral.conversions?.reduce((total: number, conv: any) => 
          total + (conv.commission_earned || 0), 0) || 0
      })) || [];

      setReferrals(transformedData);
    } catch (error: any) {
      console.error('Error fetching referrals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch referrals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const columns: ColumnDef<Referral>[] = [
    {
      accessorKey: 'campaigns.title',
      header: 'Campaign',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.original.campaigns.title}</div>
          <Badge variant="outline" className="text-xs">
            {row.original.campaigns.commission_type}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'ref_code',
      header: 'Referral Code',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <code className="text-sm bg-muted px-2 py-1 rounded">
            {row.original.ref_code}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyReferralLink(row.original.ref_code)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: '_count.clicks',
      header: 'Clicks',
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          {row.original._count.clicks}
        </div>
      ),
    },
    {
      accessorKey: '_count.conversions',
      header: 'Conversions',
      cell: ({ row }) => (
        <div className="text-center font-semibold text-success">
          {row.original._count.conversions}
        </div>
      ),
    },
    {
      id: 'conversion_rate',
      header: 'Conv. Rate',
      cell: ({ row }) => {
        const rate = row.original._count.clicks > 0 
          ? (row.original._count.conversions / row.original._count.clicks) * 100 
          : 0;
        return (
          <div className="text-center font-semibold">
            {rate.toFixed(1)}%
          </div>
        );
      },
    },
    {
      accessorKey: '_earnings',
      header: 'Earnings',
      cell: ({ row }) => (
        <div className="text-center font-semibold text-success">
          ${row.original._earnings.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyReferralLink(row.original.ref_code)}
        >
          <Copy className="h-3 w-3 mr-1" />
          Copy Link
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">My Referrals</h1>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Referrals</h1>
        <p className="text-muted-foreground">
          Track all your referral links and their performance across campaigns
        </p>
      </div>

      {referrals.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Referral Performance
            </CardTitle>
            <CardDescription>
              Detailed breakdown of clicks, conversions, and earnings for each referral link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={referrals}
              searchKey="campaigns.title"
              searchPlaceholder="Search campaigns..."
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="mb-2">No Referrals Yet</CardTitle>
          <CardDescription className="mb-4">
            You haven't joined any campaigns yet. Start by browsing available campaigns!
          </CardDescription>
          <Button asChild>
            <a href="/dashboard/campaigns">
              Browse Campaigns
            </a>
          </Button>
        </Card>
      )}
    </div>
  );
};