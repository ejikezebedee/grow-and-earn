import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, CheckCircle, XCircle, Search, RefreshCw } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface FraudAlert {
  id: string;
  type: string;
  entity_type: string;
  entity_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  data: any;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

interface FraudStats {
  totalAlerts: number;
  openAlerts: number;
  resolvedAlerts: number;
  criticalAlerts: number;
  dailyAlerts: Array<{
    date: string;
    count: number;
    severity: string;
  }>;
  alertsByType: Array<{
    type: string;
    count: number;
  }>;
}

export const FraudDetection = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [stats, setStats] = useState<FraudStats>({
    totalAlerts: 0,
    openAlerts: 0,
    resolvedAlerts: 0,
    criticalAlerts: 0,
    dailyAlerts: [],
    alertsByType: []
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchFraudAlerts();
    fetchFraudStats();
  }, [statusFilter, severityFilter]);

  const fetchFraudAlerts = async () => {
    try {
      let query = supabase
        .from('fraud_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (severityFilter !== 'all') {
        query = query.eq('severity', severityFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAlerts((data || []).map(alert => ({
        ...alert,
        severity: alert.severity as 'low' | 'medium' | 'high' | 'critical',
        status: alert.status as 'open' | 'investigating' | 'resolved' | 'false_positive'
      })));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch fraud alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFraudStats = async () => {
    try {
      const { data: allAlerts, error } = await supabase
        .from('fraud_alerts')
        .select('*');

      if (error) throw error;

      const totalAlerts = allAlerts?.length || 0;
      const openAlerts = allAlerts?.filter(a => a.status === 'open').length || 0;
      const resolvedAlerts = allAlerts?.filter(a => a.status === 'resolved').length || 0;
      const criticalAlerts = allAlerts?.filter(a => a.severity === 'critical').length || 0;

      // Process daily alerts (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const dailyAlerts = last7Days.map(date => {
        const dayAlerts = allAlerts?.filter(a => 
          a.created_at.startsWith(date)
        ) || [];
        
        return {
          date,
          count: dayAlerts.length,
          severity: 'mixed'
        };
      });

      // Process alerts by type
      const typeCount = new Map();
      allAlerts?.forEach(alert => {
        const type = alert.type.replace('_', ' ');
        typeCount.set(type, (typeCount.get(type) || 0) + 1);
      });

      const alertsByType = Array.from(typeCount.entries()).map(([type, count]) => ({
        type,
        count
      }));

      setStats({
        totalAlerts,
        openAlerts,
        resolvedAlerts,
        criticalAlerts,
        dailyAlerts,
        alertsByType
      });
    } catch (error) {
      console.error('Error fetching fraud stats:', error);
    }
  };

  const runFraudDetection = async () => {
    try {
      setActionLoading('detect');

      const response = await supabase.functions.invoke('detect-fraud', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Fraud Detection Complete",
        description: `${response.data.alertsGenerated} new alerts generated`,
      });

      fetchFraudAlerts();
      fetchFraudStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to run fraud detection",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const updateAlertStatus = async (alertId: string, status: string) => {
    try {
      setActionLoading(alertId);

      const { error } = await supabase
        .from('fraud_alerts')
        .update({ 
          status,
          resolved_at: status === 'resolved' || status === 'false_positive' ? new Date().toISOString() : null,
          resolved_by: status === 'resolved' || status === 'false_positive' ? session?.user?.id : null
        })
        .eq('id', alertId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Alert marked as ${status.replace('_', ' ')}`,
      });

      fetchFraudAlerts();
      fetchFraudStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update alert",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      low: 'secondary',
      medium: 'outline',
      high: 'default',
      critical: 'destructive'
    };

    return (
      <Badge variant={variants[severity] || 'outline'}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      open: 'destructive',
      investigating: 'default',
      resolved: 'secondary',
      false_positive: 'outline'
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const columns: ColumnDef<FraudAlert>[] = [
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">
            {row.original.type.replace('_', ' ').split(' ').map(w => 
              w.charAt(0).toUpperCase() + w.slice(1)
            ).join(' ')}
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.entity_type}: {row.original.entity_id.slice(0, 8)}...
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      cell: ({ row }) => getSeverityBadge(row.original.severity),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <p className="text-sm line-clamp-2">{row.original.description}</p>
          {row.original.data && (
            <div className="text-xs text-muted-foreground mt-1">
              {Object.entries(row.original.data).slice(0, 2).map(([key, value]) => (
                <span key={key} className="mr-2">
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Detected',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const alert = row.original;
        const isOpen = alert.status === 'open' || alert.status === 'investigating';

        if (!isOpen) {
          return (
            <Badge variant="outline">
              {alert.status === 'resolved' ? 'Resolved' : 'False Positive'}
            </Badge>
          );
        }

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateAlertStatus(alert.id, 'investigating')}
              disabled={actionLoading === alert.id || alert.status === 'investigating'}
            >
              <Search className="h-3 w-3 mr-1" />
              Investigate
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => updateAlertStatus(alert.id, 'resolved')}
              disabled={actionLoading === alert.id}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Resolve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateAlertStatus(alert.id, 'false_positive')}
              disabled={actionLoading === alert.id}
            >
              <XCircle className="h-3 w-3 mr-1" />
              False
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Fraud Detection</h1>
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
          <h1 className="text-3xl font-bold tracking-tight">Fraud Detection</h1>
          <p className="text-muted-foreground">
            Monitor and investigate suspicious activities on the platform
          </p>
        </div>
        <Button onClick={runFraudDetection} disabled={actionLoading === 'detect'}>
          <RefreshCw className={`h-4 w-4 mr-2 ${actionLoading === 'detect' ? 'animate-spin' : ''}`} />
          Run Detection
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAlerts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Alerts</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.openAlerts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.criticalAlerts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.resolvedAlerts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alert Trends (7 Days)</CardTitle>
            <CardDescription>Daily fraud alert count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.dailyAlerts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts by Type</CardTitle>
            <CardDescription>Distribution of fraud alert types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.alertsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Alerts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fraud Alerts</CardTitle>
              <CardDescription>
                Suspicious activities detected by the fraud detection system
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="false_positive">False Positive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={alerts}
            searchKey="description"
            searchPlaceholder="Search alerts..."
          />
        </CardContent>
      </Card>
    </div>
  );
};