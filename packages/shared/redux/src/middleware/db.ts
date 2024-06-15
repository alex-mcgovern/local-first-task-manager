/* eslint-disable @typescript-eslint/no-unnecessary-condition -- WIP */
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- WIP */
import type { Electric } from "@shared/electric-sql";

import { type Middleware } from "@reduxjs/toolkit";

import { type RootState } from "../store";

/**
 * Middleware that injects the Electric client into every action's meta if it exists in the Redux state
 */
export const dbMiddleware: Middleware<
	// eslint-disable-next-line @typescript-eslint/ban-types -- The recommended changes it makes are incorrect and will break your Redux store types
	{},
	RootState
> = (store) => {
	return (next) => {
		return (action) => {
			//@ts-expect-error -- WIP
			const client: Electric = store.getState().client;

			// Inject client into every action if it exists
			if (client) {
				//@ts-expect-error -- WIP
				action.meta = { ...(action.meta || {}), client };
			}
			return next(action);
		};
	};
};

// Action to set the client in the Redux state
export const setClient = (client: Electric) => {
	return {
		payload: client,
		type: "SET_CLIENT",
	};
};
