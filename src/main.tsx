import { StrictMode } from "react";

import { ErrorBoundary } from "@sentry/react";
import { RouterProvider, Toaster } from "boondoggle";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { navigate } from "wouter/use-browser-location";

import { ErrorMessage } from "@shared/components";
import { ElectricProvider } from "@shared/electric-sql";
import { store } from "@shared/redux";

import App from "./app.tsx";

import "boondoggle/dist/style.css";

const root = document.getElementById("root");
if (!root) {
	throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
	<StrictMode>
		<ErrorBoundary fallback={ErrorMessage}>
			<ElectricProvider>
				<RouterProvider navigate={navigate}>
					<ReduxProvider store={store}>
						<App />
						<Toaster />
					</ReduxProvider>
				</RouterProvider>
			</ElectricProvider>
		</ErrorBoundary>
	</StrictMode>,
);
