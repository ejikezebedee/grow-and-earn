import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  Users, 
  Wallet, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  TrendingUp,
  Megaphone,
  PenTool,
  Shield
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Overview', href: '/dashboard', icon: BarChart3 },
    ];

    if (profile?.role === 'affiliate') {
      return [
        ...baseItems,
        { name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
        { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
        { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
      ];
    }

    if (profile?.role === 'advertiser') {
      return [
        ...baseItems,
        { name: 'My Campaigns', href: '/dashboard/advertiser/campaigns', icon: Megaphone },
        { name: 'Create Campaign', href: '/dashboard/advertiser/create', icon: PenTool },
        { name: 'Analytics', href: '/dashboard/advertiser/analytics', icon: BarChart3 },
      ];
    }

    if (profile?.role === 'admin') {
      return [
        ...baseItems,
        { name: 'User Management', href: '/dashboard/admin/users', icon: Users },
        { name: 'Campaign Review', href: '/dashboard/admin/campaigns', icon: Megaphone },
        { name: 'Payouts', href: '/dashboard/admin/payouts', icon: Wallet },
        { name: 'Fraud Detection', href: '/dashboard/admin/fraud', icon: Shield },
        { name: 'Blog Management', href: '/dashboard/admin/blog', icon: PenTool },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const Sidebar = () => (
    <div className="flex h-full flex-col bg-background border-r">
      <div className="flex h-16 shrink-0 items-center px-6 border-b">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold">AffiliateHub</span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-gradient-primary text-white shadow-glow' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }
              `}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="mb-4 px-3 py-2 text-sm">
          <div className="font-medium">{profile?.full_name || 'User'}</div>
          <div className="text-muted-foreground capitalize">{profile?.role || 'Member'}</div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3" 
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-primary">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-sm">AffiliateHub</span>
          </Link>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};