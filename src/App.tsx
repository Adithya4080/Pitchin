import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/Protectedroute";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Feed = lazy(() => import("./pages/Feed"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Search = lazy(() => import("./pages/Search"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const PitchDetail = lazy(() => import("./pages/PitchDetail"));
const EditSection = lazy(() => import("./pages/EditSection"));
const Settings = lazy(() => import("./pages/Settings"));
const SharedProfile = lazy(() => import("./pages/SharedProfile"));
const SharedPitchDetail = lazy(() => import("./pages/SharedPitchDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Admin = lazy(() => import("./pages/Admin"));
const News = lazy(() => import("./pages/News"));
const Messages = lazy(() => import("./pages/Messages"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Network = lazy(() => import("./pages/network"));
const NetworkServices = lazy(() => import("./pages/NetworkServices"));
const ServiceCategoryPage = lazy(() => import("./pages/ServiceCategoryPage"));
const ProviderDetail = lazy(() => import("./pages/ProviderDetail"));

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		retry: 1,
		},
	},
});

const App = () => (
	<ErrorBoundary
		fallback={
		<div className="flex items-center justify-center min-h-screen text-center p-6">
			<div>
				<p className="text-lg font-medium mb-2">Something went wrong.</p>
				<button className="text-primary underline" onClick={() => window.location.reload()}>
					Reload the page
				</button>
			</div>
		</div>
		}
		>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<TooltipProvider>
					<Toaster />
					<Sonner />
					<BrowserRouter>
						<Suspense fallback={null}>
						<Routes> 
							<Route path="/auth" element={<Auth />} />
							<Route path="/admin" element={<Admin />} />
							<Route path="/reset-password" element={<ResetPassword />} />
							<Route path="/shared/:userId" element={<SharedProfile />} />
							<Route path="/shared/:userId/pitch/:pitchId" element={<SharedPitchDetail />} />
							<Route element={<ProtectedRoute />}>
								<Route path="/" element={<Index />} />
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
								<Route path="/news" element={<News />} />
								<Route path="/messages" element={<Messages />} />
								<Route path="/contact" element={<ContactUs />} />
								<Route path="/network" element={<Network />} />
								{/* <Route path="/network/services" element={<NetworkServices />} /> */}
								<Route path="/network/services/:slug" element={<ServiceCategoryPage />} />
								<Route path="/network/provider/:slug" element={<ProviderDetail />} />
								<Route path="/network/provider/:slug/pitch/:pitchId" element={<PitchDetail />} />
								<Route path="/network/services" element={<NetworkServices />} />
							</Route>
							{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
							<Route path="*" element={<NotFound />} />
						</Routes>
						</Suspense>
					</BrowserRouter>
				</TooltipProvider>
			</AuthProvider>
		</QueryClientProvider>
	</ErrorBoundary>
);

export default App;