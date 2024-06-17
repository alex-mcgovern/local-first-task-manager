import type { PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux";

import { createSlice } from "@reduxjs/toolkit";

// Either "all" or an array of UUIDs
type Selection = "all" | string[];

type State = { selected_tasks: Selection };

const initialState: State = { selected_tasks: [] };

export const selectTasksSlice = createSlice({
	initialState,
	name: "selectTasksSlice",
	reducers: {
		selectionUpdated: (state, action: PayloadAction<Selection>) => {
			state.selected_tasks = action.payload;
		},
	},
});

export const { selectionUpdated } = selectTasksSlice.actions;

export const selectTasksSelection = (state: RootState) => {
	return state.tasks.selection.selected_tasks;
};

export default selectTasksSlice.reducer;
