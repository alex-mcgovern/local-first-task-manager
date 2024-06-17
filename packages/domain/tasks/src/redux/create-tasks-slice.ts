import type { PayloadAction } from "@reduxjs/toolkit";

import type {
	task_priorityType as TaskPriority,
	task_statusType as TaskStatus,
} from "@shared/electric-sql";
import type { RootState } from "@shared/redux";

import { createSlice } from "@reduxjs/toolkit";

type State = {
	create_another: boolean;
	default_priority: TaskPriority;
	default_status: TaskStatus;
	is_create_task_dialog_open: boolean;
};

const initialState: State = {
	create_another: false,
	default_priority: "p1",
	default_status: "to_do",
	is_create_task_dialog_open: false,
};

const createTasksSlice = createSlice({
	initialState,
	name: "createTasksSlice",
	reducers: {
		createAnotherUpdated: (state, action: PayloadAction<boolean>) => {
			state.create_another = action.payload;
		},
		createTaskDialogOpenChange: (state, action: PayloadAction<boolean>) => {
			state.is_create_task_dialog_open = action.payload;
		},
		defaultPriorityUpdated: (state, action: PayloadAction<TaskPriority>) => {
			state.default_priority = action.payload;
		},
		defaultStatusUpdated: (state, action: PayloadAction<TaskStatus>) => {
			state.default_status = action.payload;
		},
	},
});

export const {
	createAnotherUpdated,
	createTaskDialogOpenChange,
	defaultPriorityUpdated,
	defaultStatusUpdated,
} = createTasksSlice.actions;

export const selectTasksCreateAnother = (state: RootState) => {
	return state.tasks.create.create_another;
};
export const selectTasksDefaultPriority = (state: RootState) => {
	return state.tasks.create.default_priority;
};
export const selectTasksDefaultStatus = (state: RootState) => {
	return state.tasks.create.default_status;
};
export const selectIsCreateTaskDialogOpen = (state: RootState) => {
	return state.tasks.create.is_create_task_dialog_open;
};

export default createTasksSlice.reducer;
