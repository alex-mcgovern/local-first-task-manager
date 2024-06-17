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
};

const initial_state: State = {
	due_date: undefined,
	status: ["to_do", "in_progress"],
};

export const filterTasksSlice = createSlice({
	initialState: initial_state,
	name: "filterTasksSlice",
	reducers: {
		dueDateFilterApplied: (state, action: PayloadAction<PreselectedDatetimeRange>) => {
			state.due_date = action.payload;
		},
		dueDateFilterCleared: (state) => {
			state.due_date = undefined;
		},
		statusFilterApplied: (state, action: PayloadAction<TaskStatus>) => {
			if (state.status.includes(action.payload)) {
				state.status = state.status.filter((s) => {
					return s !== action.payload;
				});
			} else {
				state.status.push(action.payload);
			}
		},
		statusFilterCleared: (state) => {
			state.status = [];
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

// Note: This selector is derived from state
export const selectDerivedTaskFilterWhereClause = (state: RootState): TaskQueryWhereClause => {
	const where: TaskQueryWhereClause = {};

	if (state.tasks.filter.due_date) {
		const { from, to } = new DateTimeRange(state.tasks.filter.due_date).range;
		where.due_date = { gte: from.toDate(), lte: to.toDate() };
	}

	if (state.tasks.filter.status.length > 0) {
		where.status = { in: state.tasks.filter.status };
	}

	return where;
};

// Note: This selector is derived from state
export const selectDerivedAreTasksFiltered = (state: RootState): boolean => {
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
			statuses: ["completed"],
			where: { status: { in: ["completed"] } },
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
			statuses: ["completed", "in_progress"],
			where: { status: { in: ["completed", "in_progress"] } },
		});
	});
}
