import failOnConsoleError from "cypress-fail-on-console-error";

import "./commands";

failOnConsoleError();

Cypress.on("uncaught:exception", (err) => {
	if (err.message.includes("ResizeObserver loop limit exceeded")) {
		return false;
	}
	return true;
});
