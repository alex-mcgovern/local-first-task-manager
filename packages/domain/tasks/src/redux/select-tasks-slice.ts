import type { PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@shared/redux";

import type { SerializableSelection } from "../lib/selection";

import { createSlice } from "@reduxjs/toolkit";

type State = { selected_tasks: SerializableSelection };

const initialState: State = { selected_tasks: [] };

const selectTasksSlice = createSlice({
	initialState,
	name: "selectTasksSlice",
	reducers: {
		selectionUpdated: (state, action: PayloadAction<SerializableSelection>) => {
			state.selected_tasks = action.payload;
		},
	},
});

export const { selectionUpdated } = selectTasksSlice.actions;

export const selectTasksSelection = (state: RootState) => {
	return state.tasks.selection.selected_tasks;
};

export default selectTasksSlice.reducer;
