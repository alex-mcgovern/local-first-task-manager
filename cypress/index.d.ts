/// <reference types="cypress" />

declare namespace Cypress {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- usually prefer types over interfaces, but this is an exception
	interface Cypress {
		env(key: "CYPRESS_BASE_URL"): string;
	}
}
