import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import UserProfile from "./pages/UserProfile";
import Onboarding from "./pages/Onboarding";
import Notifications from "./pages/Notifications";
import Search from "./pages/Search";
import ComingSoon from "./pages/ComingSoon";
import PitchDetail from "./pages/PitchDetail";
import EditSection from "./pages/EditSection";
import Settings from "./pages/Settings";
import SharedProfile from "./pages/SharedProfile";
import SharedPitchDetail from "./pages/SharedPitchDetail";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import News from "./pages/News";
import Messages from "./pages/Messages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/pitch/:pitchId" element={<PitchDetail />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/search" element={<Search />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/edit-section" element={<EditSection />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/shared/:userId" element={<SharedProfile />} />
            <Route path="/shared/:userId/pitch/:pitchId" element={<SharedPitchDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/news" element={<News />} />
            <Route path="/messages" element={<Messages />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;