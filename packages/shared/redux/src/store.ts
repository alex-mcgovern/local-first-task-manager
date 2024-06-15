import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { dbMiddleware } from "./middleware/db";
import batchReducer from "./state/task-management";

const rootReducer = combineReducers({ batchReducer });

export const store = configureStore({
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat(dbMiddleware);
	},
	reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
