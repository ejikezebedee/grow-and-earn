import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, ExternalLink, Eye } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';

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
  profiles?: {
    full_name: string;
    id: string;
  };
}

export const CampaignApprovals = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingCampaigns();
  }, []);

  const fetchPendingCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          profiles!advertiser_id(full_name, id)
        `)
        .in('status', ['pending', 'rejected'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignAction = async (campaignId: string, action: 'approve' | 'reject', rejectionReason?: string) => {
    try {
      setActionLoading(campaignId);

      const response = await supabase.functions.invoke('approve-campaign', {
        body: {
          campaignId,
          action,
          rejectionReason
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: `Campaign ${action}d successfully`,
      });

      fetchPendingCampaigns();
      setRejectionReason('');
      setSelectedCampaign(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${action} campaign`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string, rejectionReason?: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      rejected: 'destructive',
      active: 'default'
    };

    return (
      <div className="flex flex-col gap-1">
        <Badge variant={variants[status] || 'outline'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        {status === 'rejected' && rejectionReason && (
          <p className="text-xs text-destructive max-w-[200px] truncate" title={rejectionReason}>
            {rejectionReason}
          </p>
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
          <div className="text-sm text-muted-foreground">
            by {row.original.profiles?.full_name || 'Unknown'}
          </div>
          <div className="text-xs text-muted-foreground line-clamp-2 max-w-[300px]">
            {row.original.description}
          </div>
        </div>
      ),
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
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status, row.original.rejection_reason),
    },
    {
      accessorKey: 'created_at',
      header: 'Submitted',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const campaign = row.original;
        const isPending = campaign.status === 'pending';

        return (
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Campaign Review</DialogTitle>
                  <DialogDescription>
                    Review campaign details before approval or rejection
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{campaign.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted by {campaign.profiles?.full_name}
                    </p>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <p className="text-sm mt-1">{campaign.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Commission Type</Label>
                      <p className="text-sm mt-1">{campaign.commission_type}</p>
                    </div>
                    <div>
                      <Label>Commission Value</Label>
                      <p className="text-sm mt-1">
                        {campaign.commission_type === 'Revenue Share' 
                          ? `${campaign.commission_value}%`
                          : `$${campaign.commission_value}`
                        }
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>Tracking URL</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm flex-1 break-all">{campaign.tracking_url}</p>
                      <Button variant="outline" size="sm" asChild>
                        <a href={campaign.tracking_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  {campaign.banner_url && (
                    <div>
                      <Label>Banner</Label>
                      <img 
                        src={campaign.banner_url} 
                        alt="Campaign banner"
                        className="mt-2 max-w-full h-32 object-cover rounded border"
                      />
                    </div>
                  )}

                  {campaign.status === 'rejected' && campaign.rejection_reason && (
                    <div>
                      <Label className="text-destructive">Rejection Reason</Label>
                      <p className="text-sm text-destructive mt-1">{campaign.rejection_reason}</p>
                    </div>
                  )}
                </div>

                <DialogFooter className="gap-2">
                  {isPending && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setRejectionReason('');
                        }}
                        disabled={actionLoading === campaign.id}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleCampaignAction(campaign.id, 'approve')}
                        disabled={actionLoading === campaign.id}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </>
                  )}
                  {campaign.status === 'rejected' && (
                    <Button
                      onClick={() => handleCampaignAction(campaign.id, 'approve')}
                      disabled={actionLoading === campaign.id}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve Now
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {isPending && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleCampaignAction(campaign.id, 'approve')}
                  disabled={actionLoading === campaign.id}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCampaign(campaign);
                    setRejectionReason('');
                  }}
                  disabled={actionLoading === campaign.id}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Campaign Approvals</h1>
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
        <h1 className="text-3xl font-bold tracking-tight">Campaign Approvals</h1>
        <p className="text-muted-foreground">
          Review and approve or reject campaign submissions from advertisers
        </p>
      </div>

      {campaigns.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Pending Campaigns ({campaigns.filter(c => c.status === 'pending').length})</CardTitle>
            <CardDescription>
              Campaigns waiting for admin review and approval
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
          <CardTitle className="mb-2">No Campaigns to Review</CardTitle>
          <CardDescription>
            All campaigns have been processed. New submissions will appear here.
          </CardDescription>
        </Card>
      )}

      {/* Rejection Dialog */}
      <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Campaign</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{selectedCampaign?.title}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedCampaign(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedCampaign && handleCampaignAction(selectedCampaign.id, 'reject', rejectionReason)}
              disabled={!rejectionReason.trim() || actionLoading === selectedCampaign?.id}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};