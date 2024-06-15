module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: false,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended-type-checked",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
		"plugin:react-hooks/recommended",
		"plugin:perfectionist/recommended-natural",
		"plugin:eslint-comments/recommended",
		"prettier",
	],
	ignorePatterns: [
		".git",
		"dist",
		"node_modules",
		"tmp",
		"packages/shared/electric-sql/src/client",
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: [".eslintrc.{js,cjs}"],
			parserOptions: {
				sourceType: "script",
			},
		},
	],

	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		project: true,
		sourceType: "module",
		tsconfigRootDir: __dirname,
	},
	plugins: ["react-refresh", "@typescript-eslint", "react", "import", "check-file"],
	rules: {
		"@typescript-eslint/adjacent-overload-signatures": "error",
		"@typescript-eslint/array-type": "error",
		"@typescript-eslint/ban-tslint-comment": "error",
		"@typescript-eslint/class-literal-property-style": "error",
		"@typescript-eslint/consistent-generic-constructors": "error",
		"@typescript-eslint/consistent-indexed-object-style": "error",
		"@typescript-eslint/consistent-type-assertions": "error",
		"@typescript-eslint/consistent-type-definitions": ["error", "type"],
		"@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
		"@typescript-eslint/no-confusing-non-null-assertion": "error",
		"@typescript-eslint/no-duplicate-type-constituents": [
			"error",
			{
				ignoreIntersections: true,
				ignoreUnions: true,
			},
		],
		"@typescript-eslint/no-empty-function": "error",
		"@typescript-eslint/no-empty-interface": "error",
		"@typescript-eslint/no-inferrable-types": "error",
		"@typescript-eslint/no-non-null-assertion": "error",
		"@typescript-eslint/no-unnecessary-condition": "error",
		"@typescript-eslint/no-unused-vars": [
			"error",
			{
				args: "all",
				argsIgnorePattern: "^_",
				caughtErrors: "all",
				caughtErrorsIgnorePattern: "^_",
				destructuredArrayIgnorePattern: "^_",
				ignoreRestSiblings: true,
				varsIgnorePattern: "^_",
			},
		],
		"@typescript-eslint/prefer-for-of": "error",
		"@typescript-eslint/prefer-function-type": "error",
		"@typescript-eslint/prefer-namespace-keyword": "error",
		"arrow-body-style": ["error", "always"],
		"check-file/filename-naming-convention": [
			"error",
			{
				"**/*": "KEBAB_CASE",
			},
			{
				ignoreMiddleExtensions: true,
			},
		],
		"check-file/no-index": "off",
		curly: ["error", "all"],
		"eslint-comments/disable-enable-pair": ["error", { allowWholeFile: true }],
		"eslint-comments/no-unused-disable": "error",
		"eslint-comments/require-description": ["error", { ignore: [] }],
		"import/no-cycle": "error",
		"import/no-duplicates": ["error", { considerQueryString: true }],
		"import/no-extraneous-dependencies": "error",
		"import/no-namespace": ["error", { ignore: ["@shared/i18n"] }],
		"import/no-relative-packages": "error",
		"no-console": ["error", { allow: ["warn", "error", "info"] }],
		"no-empty-function": "off",
		"no-restricted-imports": [
			"error",
			{
				paths: [
					{
						message: "Usually you want to import from boondoggle/*",
						name: "react-aria-components",
					},
					{
						message: "Use deep import, e.g. `@fortawesome/pro-solid-svg-icons/faCheck`",
						name: "@fortawesome/pro-solid-svg-icons",
					},
					{
						message: "Use deep import, e.g. `@fortawesome/pro-solid-svg-icons/faCheck`",
						name: "@fortawesome/pro-regular-svg-icons",
					},
				],
			},
		],
		"perfectionist/sort-imports": [
			"error",
			{
				"custom-groups": {
					type: {
						"packages-domain-type": "@domain/*",
						"packages-shared-type": "@shared/*",
						"react-type": "react",
					},
					value: {
						"packages-domain": "@domain/*",
						"packages-shared": "@shared/*",
						react: "react",
					},
				},
				groups: [
					"type",
					"react-type",
					"packages-shared-type",
					"packages-domain-type",
					"internal-type",
					["parent-type", "sibling-type", "index-type"],
					"react",
					["builtin", "external"],
					"packages-shared",
					"packages-domain",
					"internal",
					["parent", "sibling", "index"],
					"side-effect",
					"style",
					"object",
					"unknown",
				],
				"internal-pattern": ["domain/**", "lib/**", "components/**"],
				"newlines-between": "never",
				order: "asc",
				type: "natural",
			},
		],
		"react/display-name": "off",
		"react/function-component-definition": "error",
		"react/prop-types": "off",
		"react/self-closing-comp": [
			"error",
			{
				component: true,
				html: true,
			},
		],
		"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};
