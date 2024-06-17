import type { KnipConfig } from "knip";

const config: KnipConfig = {
	entry: ["cypress/support/commands.ts", "src/main.tsx", "packages/*/*/index.{tsx,ts}"],
	ignore: ["packages/shared/electric-sql/src/client/*"],
	ignoreDependencies: [
		// This is a dependency of electric-sql used to apply migrations, but it's not imported anywhere in the codebase
		"@databases/pg-migrations",
	],
	project: ["src/**/*.{js,jsx,ts,tsx}"],
};

export default config;
