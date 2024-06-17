import type { PayloadAction } from "@reduxjs/toolkit";

import type { Tasks as Task, TasksFindManyArgsSchema } from "@shared/electric-sql";
import type { RootState } from "@shared/redux";

import { createSlice } from "@reduxjs/toolkit";

// This is the type that is passed into the Electric SQL query `orderBy` argument
type TaskQueryOrderByClause = Zod.infer<typeof TasksFindManyArgsSchema>["orderBy"];

// This is information that is passed into the `react-aria-components` <Table> component
// It's a different representation of the same information that is passed into the SQL query
type SortDescriptor = {
	column: keyof Task;
	direction: "ascending" | "descending" | undefined; // Note that the naming is for the UI library, not the SQL (which would "asc" / "desc")
};

type State = {
	order_by_clause: TaskQueryOrderByClause;
	sort_descriptor: SortDescriptor | undefined;
};

const initial_state: State = { order_by_clause: { status: "desc" }, sort_descriptor: undefined };

const sortTasksSlice = createSlice({
	initialState: initial_state,
	name: "sortTasksSlice",
	reducers: {
		columnSorted: (state, action: PayloadAction<SortDescriptor>) => {
			state.sort_descriptor = action.payload;

			if (
				state.order_by_clause &&
				action.payload.direction === undefined &&
				action.payload.column in state.order_by_clause
			) {
				state.order_by_clause = undefined;
			} else {
				state.order_by_clause = {
					[action.payload.column]:
						action.payload.direction === "ascending" ? "asc" : "desc",
				};
			}
		},
	},
});

export const { columnSorted } = sortTasksSlice.actions;

export const selectTasksOrderByClause = (state: RootState) => {
	return state.tasks.order.order_by_clause;
};
export const selectTasksSortDescriptor = (state: RootState) => {
	return state.tasks.order.sort_descriptor;
};

export default sortTasksSlice.reducer;
