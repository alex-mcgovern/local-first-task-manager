/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	envPrefix: "ELECTRIC_",
	optimizeDeps: {
		exclude: ["wa-sqlite"],
	},
	plugins: [react()],
	test: {
		includeSource: ["src/**/*.{js,ts}", "packages/**/*.{js,ts}"],
	},
});
