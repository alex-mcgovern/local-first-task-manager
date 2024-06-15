import { combineReducers, configureStore } from "@reduxjs/toolkit";
import batchReducer from "./state/task-management";
import { dbMiddleware } from "./middleware/db";

const rootReducer = combineReducers({ batchReducer });

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat(dbMiddleware);
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
