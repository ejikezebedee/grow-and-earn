import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Eye, Pause, Play, Trash, ExternalLink } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  status: string;
  commission_type: string;
  commission_value: number;
  banner_url?: string;
  tracking_url: string;
  created_at: string;
  rejection_reason?: string;
  _count?: {
    referrals: number;
    clicks: number;
    conversions: number;
  };
}

export const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCampaigns();
    }
  }, [user]);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          referrals(count),
          referrals!inner(
            clicks(count),
            conversions(count)
          )
        `)
        .eq('advertiser_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to include counts
        const transformedData = data?.map(campaign => ({
        ...campaign,
        _count: {
          referrals: campaign.referrals?.length || 0,
          clicks: campaign.referrals?.reduce((total: number, ref: any) => total + (ref.clicks || 0), 0) || 0,
          conversions: campaign.referrals?.reduce((total: number, ref: any) => total + (ref.conversions || 0), 0) || 0
        }
      })) || [];

      setCampaigns(transformedData);
    } catch (error: any) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCampaignStatus = async (campaignId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ status })
        .eq('id', campaignId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Campaign ${status === 'paused' ? 'paused' : 'activated'} successfully`,
      });

      fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });

      fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string, rejectionReason?: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      pending: 'secondary',
      rejected: 'destructive',
      paused: 'outline'
    };

    return (
      <div className="flex flex-col gap-1">
        <Badge variant={variants[status] || 'outline'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        {status === 'rejected' && rejectionReason && (
          <p className="text-xs text-destructive">{rejectionReason}</p>
        )}
      </div>
    );
  };

  const columns: ColumnDef<Campaign>[] = [
    {
      accessorKey: 'title',
      header: 'Campaign',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.original.title}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">
            {row.original.description}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status, row.original.rejection_reason),
    },
    {
      accessorKey: 'commission_type',
      header: 'Commission',
      cell: ({ row }) => (
        <div className="text-center">
          <div className="font-semibold">
            {row.original.commission_type === 'Revenue Share' 
              ? `${row.original.commission_value}%`
              : `$${row.original.commission_value}`
            }
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.commission_type}
          </div>
        </div>
      ),
    },
    {
      accessorKey: '_count.referrals',
      header: 'Affiliates',
      cell: ({ row }) => row.original._count?.referrals || 0,
    },
    {
      accessorKey: '_count.clicks',
      header: 'Clicks',
      cell: ({ row }) => row.original._count?.clicks || 0,
    },
    {
      accessorKey: '_count.conversions',
      header: 'Conversions',
      cell: ({ row }) => row.original._count?.conversions || 0,
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const campaign = row.original;
        const canEdit = campaign.status === 'pending' || campaign.status === 'rejected';
        const canToggle = campaign.status === 'active' || campaign.status === 'paused';

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a 
                  href={campaign.tracking_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Landing Page
                </a>
              </DropdownMenuItem>
              
              {canEdit && (
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Campaign
                </DropdownMenuItem>
              )}
              
              {canToggle && (
                <DropdownMenuItem
                  onClick={() => updateCampaignStatus(
                    campaign.id, 
                    campaign.status === 'active' ? 'paused' : 'active'
                  )}
                >
                  {campaign.status === 'active' ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause Campaign
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Activate Campaign
                    </>
                  )}
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Campaign
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{campaign.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteCampaign(campaign.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Campaigns</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
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
          <h1 className="text-3xl font-bold tracking-tight">My Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your affiliate marketing campaigns
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/advertiser/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Link>
        </Button>
      </div>

      {campaigns.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>All Campaigns</CardTitle>
            <CardDescription>
              View and manage your campaigns, track performance, and make adjustments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={campaigns}
              searchKey="title"
              searchPlaceholder="Search campaigns..."
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <CardTitle className="mb-4">No Campaigns Yet</CardTitle>
          <CardDescription className="mb-6">
            Create your first affiliate marketing campaign to start working with affiliates.
          </CardDescription>
          <Button asChild>
            <Link to="/dashboard/advertiser/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
};