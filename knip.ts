import type { KnipConfig } from "knip";

const config: KnipConfig = {
	entry: ["cypress/support/commands.ts", "src/main.tsx", "packages/*/*/index.{tsx,ts}"],
	ignore: ["packages/shared/i18n", "packages/shared/auth"],
	ignoreDependencies: ["husky"],
	project: ["src/**/*.{js,jsx,ts,tsx}"],
};

export default config;
