import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { UserCheck, UserX, Shield, Settings, Ban, CheckCircle } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
  auth_users?: {
    email: string;
    last_sign_in_at: string;
  };
  user_suspensions?: Array<{
    id: string;
    reason: string;
    suspended_at: string;
    is_active: boolean;
  }>;
  _count?: {
    campaigns: number;
    referrals: number;
    wallet_transactions: number;
  };
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'role' | 'suspend' | 'unsuspend' | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [suspensionReason, setSuspensionReason] = useState('');
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_suspensions!user_id(
            id,
            reason,
            suspended_at,
            is_active
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user emails from auth.users (requires service role, so we'll approximate)
      const transformedUsers = data?.map(user => ({
        ...user,
        _count: {
          campaigns: 0, // We could fetch this with additional queries
          referrals: 0,
          wallet_transactions: 0
        },
        auth_users: {
          email: 'user@example.com', // In a real app, you'd need service role access
          last_sign_in_at: new Date().toISOString()
        }
      })) || [];

      setUsers(transformedUsers);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string, newRole?: string, suspensionReason?: string) => {
    try {
      setActionLoading(userId);

      const response = await supabase.functions.invoke('manage-user-role', {
        body: {
          userId,
          action,
          newRole,
          suspensionReason
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: response.data.message,
      });

      fetchUsers();
      setSelectedUser(null);
      setActionType(null);
      setNewRole('');
      setSuspensionReason('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to perform action",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      admin: 'destructive',
      advertiser: 'default',
      affiliate: 'secondary'
    };

    const icons = {
      admin: Shield,
      advertiser: Settings,
      affiliate: UserCheck
    };

    const IconComponent = icons[role as keyof typeof icons] || UserCheck;

    return (
      <Badge variant={variants[role] || 'outline'} className="gap-1">
        <IconComponent className="h-3 w-3" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getUserStatus = (user: User) => {
    const activeSuspension = user.user_suspensions?.find(s => s.is_active);
    
    if (activeSuspension) {
      return (
        <Badge variant="destructive" className="gap-1">
          <Ban className="h-3 w-3" />
          Suspended
        </Badge>
      );
    }
    
    return (
      <Badge variant="default" className="gap-1">
        <CheckCircle className="h-3 w-3" />
        Active
      </Badge>
    );
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'full_name',
      header: 'User',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.original.full_name}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.auth_users?.email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => getRoleBadge(row.original.role),
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => getUserStatus(row.original),
    },
    {
      accessorKey: 'created_at',
      header: 'Joined',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      id: 'last_active',
      header: 'Last Active',
      cell: ({ row }) => {
        const lastSignIn = row.original.auth_users?.last_sign_in_at;
        return lastSignIn ? new Date(lastSignIn).toLocaleDateString() : 'Never';
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;
        const isCurrentUser = user.id === session?.user?.id;
        const isSuspended = user.user_suspensions?.some(s => s.is_active);

        if (isCurrentUser) {
          return <Badge variant="outline">You</Badge>;
        }

        return (
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Manage
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage User</DialogTitle>
                  <DialogDescription>
                    Manage {user.full_name}'s role and account status
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Current Role</Label>
                      <div className="mt-1">{getRoleBadge(user.role)}</div>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div className="mt-1">{getUserStatus(user)}</div>
                    </div>
                  </div>

                  {user.user_suspensions?.length > 0 && (
                    <div>
                      <Label>Suspension History</Label>
                      <div className="mt-2 space-y-2">
                        {user.user_suspensions.map((suspension, index) => (
                          <div key={index} className="text-sm p-2 border rounded">
                            <div className="font-medium">
                              {new Date(suspension.suspended_at).toLocaleDateString()}
                              {suspension.is_active && <Badge className="ml-2" variant="destructive">Active</Badge>}
                            </div>
                            <div className="text-muted-foreground">{suspension.reason}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="flex-col space-y-2">
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(user);
                        setActionType('role');
                        setNewRole(user.role);
                      }}
                      disabled={actionLoading === user.id}
                    >
                      Change Role
                    </Button>
                    
                    {isSuspended ? (
                      <Button
                        variant="default"
                        onClick={() => handleUserAction(user.id, 'unsuspend')}
                        disabled={actionLoading === user.id}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Unsuspend
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSelectedUser(user);
                          setActionType('suspend');
                          setSuspensionReason('');
                        }}
                        disabled={actionLoading === user.id}
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Suspend
                      </Button>
                    )}
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
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
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage user roles, permissions, and account status
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affiliates</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'affiliate').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advertisers</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'advertiser').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.user_suspensions?.some(s => s.is_active)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage user accounts, roles, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={users}
            searchKey="full_name"
            searchPlaceholder="Search users..."
          />
        </CardContent>
      </Card>

      {/* Role Change Dialog */}
      <Dialog open={actionType === 'role'} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUser?.full_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>New Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="affiliate">Affiliate</SelectItem>
                  <SelectItem value="advertiser">Advertiser</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedUser && handleUserAction(selectedUser.id, 'change_role', newRole)}
              disabled={!newRole || newRole === selectedUser?.role || actionLoading === selectedUser?.id}
            >
              Change Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspension Dialog */}
      <Dialog open={actionType === 'suspend'} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Suspend {selectedUser?.full_name} from accessing the platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="suspension-reason">Reason for Suspension</Label>
              <Textarea
                id="suspension-reason"
                placeholder="Enter the reason for suspension..."
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedUser && handleUserAction(selectedUser.id, 'suspend', undefined, suspensionReason)}
              disabled={!suspensionReason.trim() || actionLoading === selectedUser?.id}
            >
              <Ban className="h-4 w-4 mr-1" />
              Suspend User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};