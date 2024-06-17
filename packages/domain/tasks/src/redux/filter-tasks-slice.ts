import type { PayloadAction } from "@reduxjs/toolkit";

import type { PreselectedDatetimeRange } from "@shared/date";
import type { task_statusType as TaskStatus, TasksFindManyArgsSchema } from "@shared/electric-sql";
import type { RootState } from "@shared/redux";

import { createSlice } from "@reduxjs/toolkit";

import { DateTimeRange } from "@shared/date";

type TaskQueryWhereClause = Zod.infer<typeof TasksFindManyArgsSchema>["where"];

type State = {
	due_date: PreselectedDatetimeRange | undefined;
	status: TaskStatus[];
	where_clause: TaskQueryWhereClause;
};

const initial_state: State = {
	due_date: undefined,
	status: [],
	where_clause: {},
};

const filterTasksSlice = createSlice({
	initialState: initial_state,
	name: "filterTasksSlice",
	reducers: {
		dueDateFilterApplied: (state, action: PayloadAction<PreselectedDatetimeRange>) => {
			state.due_date = action.payload;
			const { from, to } = new DateTimeRange(action.payload).range;

			// Update the `where_clause` passed into the Electric SQL query
			if (state.where_clause) {
				state.where_clause.due_date = { gte: from.toDate(), lte: to.toDate() };
			}
		},
		dueDateFilterCleared: (state) => {
			state.due_date = undefined;

			// Update the `where_clause` passed into the Electric SQL query
			if (state.where_clause?.due_date) {
				delete state.where_clause.due_date;
			}
		},
		statusFilterApplied: (state, action: PayloadAction<TaskStatus>) => {
			// For simplicity, we'll track the status filter list
			// directly in state. If the status is already in the list,
			// remove it, otherwise, add it

			if (state.status.includes(action.payload)) {
				state.status = state.status.filter((s) => {
					return s !== action.payload;
				});
			} else {
				state.status.push(action.payload);
			}

			// Update the `where_clause` passed into the Electric SQL query
			if (state.where_clause?.status && state.status.length === 0) {
				delete state.where_clause.status;
			} else if (state.where_clause) {
				state.where_clause.status = { in: state.status };
			}
		},
		statusFilterCleared: (state) => {
			state.status = [];

			// Update the `where_clause` passed into the Electric SQL query
			if (state.where_clause?.status) {
				delete state.where_clause.status;
			}
		},
	},
});

export const {
	dueDateFilterApplied,
	dueDateFilterCleared,
	statusFilterApplied,
	statusFilterCleared,
} = filterTasksSlice.actions;

export const selectTaskFilterStatus = (state: RootState) => {
	return state.tasks.filter.status;
};
export const selectTaskFilterDueDate = (state: RootState) => {
	return state.tasks.filter.due_date;
};

export const selectTaskFilterWhereClause = (state: RootState): TaskQueryWhereClause => {
	return state.tasks.filter.where_clause;
};
export const selectAreTasksFiltered = (state: RootState): boolean => {
	return !!state.tasks.filter.due_date || state.tasks.filter.status.length > 0;
};

export default filterTasksSlice.reducer;

if (import.meta.vitest) {
	const { expect, it } = import.meta.vitest;

	it("filters by task status correctly", () => {
		let state = filterTasksSlice.reducer(undefined, { type: "unknown" });
		expect(state).toEqual(initial_state);

		// Adding a status to the filter list updates both the list and the `where` clause

		state = filterTasksSlice.reducer(
			state,
			filterTasksSlice.actions.statusFilterApplied("completed"),
		);
		expect(state).toEqual({
			...initial_state,
			status: ["completed"],
			where_clause: { status: { in: ["completed"] } },
		});

		// Adding the same status again removes it from the filter list and the `where` clause

		state = filterTasksSlice.reducer(
			state,
			filterTasksSlice.actions.statusFilterApplied("completed"),
		);
		expect(state).toEqual(initial_state);

		// Adding multiple statuses to the filter list updates both the list and the `where` clause

		state = filterTasksSlice.reducer(
			state,
			filterTasksSlice.actions.statusFilterApplied("completed"),
		);
		state = filterTasksSlice.reducer(
			state,
			filterTasksSlice.actions.statusFilterApplied("in_progress"),
		);
		expect(state).toEqual({
			...initial_state,
			status: ["completed", "in_progress"],
			where_clause: { status: { in: ["completed", "in_progress"] } },
		});
	});
}
