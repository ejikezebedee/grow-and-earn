import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, CheckCircle, XCircle, CreditCard, Download } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';

interface PayoutRequest {
  id: string;
  amount: number;
  method: string;
  payout_details: any;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'failed';
  requested_at: string;
  processed_at?: string;
  transaction_id?: string;
  profiles: {
    full_name: string;
    wallet_address?: string;
  };
}

interface PayoutStats {
  totalPending: number;
  pendingAmount: number;
  completedAmount: number;
  totalRequests: number;
}

export const PayoutManagement = () => {
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [stats, setStats] = useState<PayoutStats>({
    totalPending: 0,
    pendingAmount: 0,
    completedAmount: 0,
    totalRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPayoutRequests();
    fetchPayoutStats();
  }, []);

  const fetchPayoutRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('payout_requests')
        .select(`
          *,
          profiles!affiliate_id(full_name, wallet_address)
        `)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setPayoutRequests((data || []).map(payout => ({
        ...payout,
        status: payout.status as 'pending' | 'approved' | 'processing' | 'completed' | 'failed'
      })));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch payout requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPayoutStats = async () => {
    try {
      const { data: requests, error } = await supabase
        .from('payout_requests')
        .select('amount, status');

      if (error) throw error;

      const totalPending = requests?.filter(r => r.status === 'pending').length || 0;
      const pendingAmount = requests?.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0) || 0;
      const completedAmount = requests?.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.amount, 0) || 0;
      const totalRequests = requests?.length || 0;

      setStats({
        totalPending,
        pendingAmount,
        completedAmount,
        totalRequests
      });
    } catch (error) {
      console.error('Error fetching payout stats:', error);
    }
  };

  const processBatchPayouts = async () => {
    if (selectedRequests.length === 0) return;

    try {
      setActionLoading('batch');

      const response = await supabase.functions.invoke('process-payout-batch', {
        body: {
          payoutRequestIds: selectedRequests
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Batch Processing Complete",
        description: response.data.message,
      });

      fetchPayoutRequests();
      fetchPayoutStats();
      setSelectedRequests([]);
      setShowBatchDialog(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process batch payouts",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const updatePayoutStatus = async (payoutId: string, status: 'approved' | 'failed') => {
    try {
      setActionLoading(payoutId);

      const { error } = await supabase
        .from('payout_requests')
        .update({ 
          status,
          processed_at: new Date().toISOString(),
          processed_by: session?.user?.id
        })
        .eq('id', payoutId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Payout ${status}`,
      });

      fetchPayoutRequests();
      fetchPayoutStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update payout",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const exportPayouts = () => {
    const csvData = payoutRequests.map(payout => ({
      'Request ID': payout.id,
      'Affiliate': payout.profiles.full_name,
      'Amount': payout.amount.toFixed(2),
      'Method': payout.method,
      'Status': payout.status,
      'Requested': new Date(payout.requested_at).toLocaleDateString(),
      'Processed': payout.processed_at ? new Date(payout.processed_at).toLocaleDateString() : '',
      'Transaction ID': payout.transaction_id || ''
    }));

    const headers = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payout-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      approved: 'default',
      processing: 'outline',
      completed: 'default',
      failed: 'destructive'
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const columns: ColumnDef<PayoutRequest>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              const pendingIds = table.getRowModel().rows
                .filter(row => row.original.status === 'pending')
                .map(row => row.original.id);
              setSelectedRequests(pendingIds);
            } else {
              setSelectedRequests([]);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => {
        const isPending = row.original.status === 'pending';
        return (
          <Checkbox
            checked={selectedRequests.includes(row.original.id)}
            onCheckedChange={(value) => {
              if (value && isPending) {
                setSelectedRequests(prev => [...prev, row.original.id]);
              } else {
                setSelectedRequests(prev => prev.filter(id => id !== row.original.id));
              }
            }}
            disabled={!isPending}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'profiles.full_name',
      header: 'Affiliate',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.original.profiles.full_name}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.method.toUpperCase()}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <div className="font-semibold">${row.original.amount.toFixed(2)}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: 'requested_at',
      header: 'Requested',
      cell: ({ row }) => new Date(row.original.requested_at).toLocaleDateString(),
    },
    {
      accessorKey: 'processed_at',
      header: 'Processed',
      cell: ({ row }) => {
        return row.original.processed_at 
          ? new Date(row.original.processed_at).toLocaleDateString()
          : '-';
      },
    },
    {
      accessorKey: 'transaction_id',
      header: 'Transaction ID',
      cell: ({ row }) => {
        const txId = row.original.transaction_id;
        return txId ? (
          <code className="text-xs">{txId.slice(0, 12)}...</code>
        ) : '-';
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const payout = row.original;
        const isPending = payout.status === 'pending';

        if (!isPending) {
          return payout.status === 'completed' ? (
            <Badge variant="default">Paid</Badge>
          ) : (
            <Badge variant={payout.status === 'failed' ? 'destructive' : 'outline'}>
              {payout.status}
            </Badge>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => updatePayoutStatus(payout.id, 'approved')}
              disabled={actionLoading === payout.id}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updatePayoutStatus(payout.id, 'failed')}
              disabled={actionLoading === payout.id}
            >
              <XCircle className="h-3 w-3 mr-1" />
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Payout Management</h1>
        <div className="grid gap-4 md:grid-cols-4">
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
          <h1 className="text-3xl font-bold tracking-tight">Payout Management</h1>
          <p className="text-muted-foreground">
            Process affiliate payout requests and manage payment history
          </p>
        </div>
        <Button onClick={exportPayouts} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <CreditCard className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.totalPending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">${stats.pendingAmount.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Payouts</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">${stats.completedAmount.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payout Requests</CardTitle>
              <CardDescription>
                Manage affiliate payout requests and process payments
              </CardDescription>
            </div>
            {selectedRequests.length > 0 && (
              <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Process Selected ({selectedRequests.length})
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Batch Process Payouts</DialogTitle>
                    <DialogDescription>
                      Process {selectedRequests.length} selected payout requests. This will trigger payments via PayPal API.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm font-medium mb-2">Selected Payouts:</div>
                      {payoutRequests
                        .filter(p => selectedRequests.includes(p.id))
                        .map(payout => (
                          <div key={payout.id} className="flex justify-between text-sm">
                            <span>{payout.profiles.full_name}</span>
                            <span>${payout.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>
                          ${payoutRequests
                            .filter(p => selectedRequests.includes(p.id))
                            .reduce((sum, p) => sum + p.amount, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowBatchDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={processBatchPayouts}
                      disabled={actionLoading === 'batch'}
                    >
                      <CreditCard className="h-4 w-4 mr-1" />
                      Process Payouts
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={payoutRequests}
            searchKey="profiles.full_name"
            searchPlaceholder="Search affiliates..."
          />
        </CardContent>
      </Card>
    </div>
  );
};