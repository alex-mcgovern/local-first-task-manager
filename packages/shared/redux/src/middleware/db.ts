import { type Middleware } from "@reduxjs/toolkit";
import type { Electric } from "@shared/electric-sql";
import { type RootState } from "../store";

/**
 * Middleware that injects the Electric client into every action's meta if it exists in the Redux state
 */
export const dbMiddleware: Middleware<
	// eslint-disable-next-line @typescript-eslint/ban-types -- The recommended changes it makes are incorrect and will break your Redux store types
	{},
	RootState
> = (store) => (next) => (action) => {
	const client: Electric = store.getState().client;

	// Inject client into every action if it exists
	if (client) {
		action.meta = { ...(action.meta || {}), client };
	}
	return next(action);
};

// Action to set the client in the Redux state
export const setClient = (client: Electric) => ({
	type: "SET_CLIENT",
	payload: client,
});
