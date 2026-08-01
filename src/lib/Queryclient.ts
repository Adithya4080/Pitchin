import { QueryClient } from "@tanstack/react-query";

// Shared instance — imported by App.tsx (for QueryClientProvider) and by
// useAuth.tsx (to clear cached data on login/logout so one account never
// sees another account's cached response, e.g. GET /services/my-provider/).
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			retry: 1,
		},
	},
});