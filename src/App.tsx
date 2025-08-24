import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Overview } from "@/components/dashboard/Overview";
import Index from "./pages/Index";
import { Auth } from "./pages/Auth";
import { Blog } from "./pages/Blog";
import Pricing from "./pages/Pricing";
import Help from "./pages/Help";
import { Campaigns } from "./pages/affiliate/Campaigns";
import { Wallet } from "./pages/affiliate/Wallet";
import { CreateCampaign } from "./pages/advertiser/CreateCampaign";
import { Campaigns as AdvertiserCampaigns } from "./pages/advertiser/Campaigns";
import { Analytics as AdvertiserAnalytics } from "./pages/advertiser/Analytics";
import { Referrals } from "./pages/affiliate/Referrals";
import { CampaignApprovals } from "./pages/admin/CampaignApprovals";
import { UserManagement } from "./pages/admin/UserManagement";
import { FraudDetection } from "./pages/admin/FraudDetection";
import { PayoutManagement } from "./pages/admin/PayoutManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Blog />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/help" element={<Help />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Overview />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Affiliate Routes */}
            <Route path="/dashboard/campaigns" element={
              <ProtectedRoute role="affiliate">
                <DashboardLayout>
                  <Campaigns />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/referrals" element={
              <ProtectedRoute role="affiliate">
                <DashboardLayout>
                  <Referrals />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/wallet" element={
              <ProtectedRoute role="affiliate">
                <DashboardLayout>
                  <Wallet />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Advertiser Routes */}
            <Route path="/dashboard/advertiser/create" element={
              <ProtectedRoute role="advertiser">
                <DashboardLayout>
                  <CreateCampaign />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/advertiser/campaigns" element={
              <ProtectedRoute role="advertiser">
                <DashboardLayout>
                  <AdvertiserCampaigns />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/advertiser/analytics" element={
              <ProtectedRoute role="advertiser">
                <DashboardLayout>
                  <AdvertiserAnalytics />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/dashboard/admin/campaigns" element={
              <ProtectedRoute role="admin">
                <DashboardLayout>
                  <CampaignApprovals />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/admin/users" element={
              <ProtectedRoute role="admin">
                <DashboardLayout>
                  <UserManagement />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/admin/fraud" element={
              <ProtectedRoute role="admin">
                <DashboardLayout>
                  <FraudDetection />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/admin/payouts" element={
              <ProtectedRoute role="admin">
                <DashboardLayout>
                  <PayoutManagement />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Redirect old dashboard route */}
            <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
            
            {/* Referral tracking route */}
            <Route path="/ref/:refCode" element={<ReferralRedirect />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Referral redirect component
const ReferralRedirect = () => {
  const { refCode } = useParams<{ refCode: string }>();
  
  useEffect(() => {
    const trackAndRedirect = async () => {
      if (!refCode) {
        console.log('No referral code provided, redirecting to homepage');
        window.location.href = '/';
        return;
      }

      console.log('Tracking click for referral code:', refCode);
      
      try {
        // Track the click using our Edge Function
        const response = await fetch(`https://qbpqcxlpgiyietlcadis.supabase.co/functions/v1/track-click/${refCode}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('Track click response:', data);

        if (data.success && data.redirectUrl) {
          console.log('Redirecting to:', data.redirectUrl);
          window.location.href = data.redirectUrl;
        } else {
          console.log('No redirect URL provided, going to homepage');
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error tracking click:', error);
        // Fallback to homepage on error
        window.location.href = '/';
      }
    };

    trackAndRedirect();
  }, [refCode]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p>Tracking your referral...</p>
        <p className="text-sm text-muted-foreground">You'll be redirected shortly</p>
      </div>
    </div>
  );
};

export default App;
