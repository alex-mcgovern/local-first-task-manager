import { StrictMode } from "react";

import { RouterProvider, Toaster } from "boondoggle";
import ReactDOM from "react-dom/client";
import { navigate } from "wouter/use-browser-location";

import App from "./app.tsx";
import { ElectricProvider } from "@shared/electric-sql";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@shared/redux";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ElectricProvider>
			{/* <ErrorBoundary fallback={ErrorMessage}> */}
			<RouterProvider navigate={navigate}>
				<ReduxProvider store={store}>
					<App />
					<Toaster />
				</ReduxProvider>
			</RouterProvider>
		</ElectricProvider>
		{/* </ErrorBoundary> */}
	</StrictMode>,
);
