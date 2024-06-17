import { combineReducers, configureStore } from "@reduxjs/toolkit";

import {
	taskCreationReducer,
	taskFilterReducer,
	taskOrderingReducer,
	taskSelectionReducer,
} from "@domain/tasks";

const tasksReducer = combineReducers({
	create: taskCreationReducer,
	filter: taskFilterReducer,
	order: taskOrderingReducer,
	selection: taskSelectionReducer,
});

const rootReducer = combineReducers({ tasks: tasksReducer });

export const store = configureStore({
	reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
