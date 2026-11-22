import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { GlobalStyle } from "./GlobalStyle.ts";
import { showErrorToast } from "./utils/showErrorToast.ts";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			// Only when there's nothing to show yet. If a background refetch fails
			//the cached data stays on screen and a toast every second would be noise.
			if (query.state.data === undefined) showErrorToast(error);
		},
	}),
	mutationCache: new MutationCache({
		onError: (error) => showErrorToast(error),
	}),
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<GlobalStyle />
				<Toaster theme="dark" position="bottom-right" richColors closeButton />
				<App />
			</QueryClientProvider>
		</BrowserRouter>
	</StrictMode>,
);
