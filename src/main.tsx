import { StrictMode } from "react";

import { RouterProvider, Toaster } from "boondoggle";
import ReactDOM from "react-dom/client";
import { navigate } from "wouter/use-browser-location";

import App from "./app.tsx";
import { ElectricProvider } from "@shared/electric-sql";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ElectricProvider>
			{/* <ErrorBoundary fallback={ErrorMessage}> */}
			<RouterProvider navigate={navigate}>
				<App />
				<Toaster />
			</RouterProvider>
		</ElectricProvider>
		{/* </ErrorBoundary> */}
	</StrictMode>,
);
