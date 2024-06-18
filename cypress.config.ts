import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		baseUrl: "http://localhost:5173/",
		excludeSpecPattern: ["**/*/_*.cy.ts"],
		retries: {
			runMode: 3,
		},
		screenshotOnRunFailure: false,
		trashAssetsBeforeRuns: true,
		video: false,
	},
	env: {
		CYPRESS_BASE_URL: "http://localhost:5173/",
	},
});
