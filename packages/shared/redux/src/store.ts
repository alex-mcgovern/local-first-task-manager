import { combineReducers, configureStore } from "@reduxjs/toolkit";
import taskManagementReducer from "./state/task-management";

const rootReducer = combineReducers({ taskManagementReducer });

export const store = configureStore({
	reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
