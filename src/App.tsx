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
import { Campaigns } from "./pages/affiliate/Campaigns";
import { Wallet } from "./pages/affiliate/Wallet";
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
            
            <Route path="/dashboard/wallet" element={
              <ProtectedRoute role="affiliate">
                <DashboardLayout>
                  <Wallet />
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
  const { refCode } = useParams();
  
  useEffect(() => {
    if (refCode) {
      // Track the click
      fetch(`https://qbpqcxlpgiyietlcadis.supabase.co/functions/v1/track-click/${refCode}`, {
        method: 'POST',
      })
      .then(response => response.json())
      .then(data => {
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          // Fallback to homepage if no redirect URL
          window.location.href = '/';
        }
      })
      .catch(() => {
        // Fallback to homepage on error
        window.location.href = '/';
      });
    }
  }, [refCode]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Redirecting...</p>
      </div>
    </div>
  );
};

export default App;
