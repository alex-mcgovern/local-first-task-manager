import type { PayloadAction } from "@reduxjs/toolkit";
// eslint-disable-next-line no-restricted-imports -- usually discourage direct import from `react-aria-components`, but this is necessary
import type { Selection } from "react-aria-components";
import type { PreselectedDatetimeRange } from "@shared/date";
import type { TasksFindManyArgsSchema, task_statusType } from "@shared/electric-sql";
import type { RootState } from "../store";
import { createSlice } from "@reduxjs/toolkit";
import { DateTimeRange } from "@shared/date";

// Parameter for the `where` clause of the electric `tasks.findMany` query
type Where = Zod.infer<typeof TasksFindManyArgsSchema>["where"];

// Parameter for the `orderBy` clause of the electric `tasks.findMany` query
type OrderBy = Zod.infer<typeof TasksFindManyArgsSchema>["orderBy"];

type State = {
	filterDueDate: PreselectedDatetimeRange | undefined;
	orderBy: OrderBy;
	selectedTasks: Selection;
	statusFilterList: task_statusType[];
	where: Where;
};

const initialState: State = {
	filterDueDate: undefined,
	orderBy: { created_at: "asc" },
	selectedTasks: new Set(),
	statusFilterList: [],
	where: {},
};

export const taskManagement = createSlice({
	initialState,
	name: "taskManagement",
	reducers: {
		clearFilterDueDate: (state) => {
			state.filterDueDate = undefined;
			if (state.where?.due_date) {
				delete state.where.due_date;
			}
		},
		clearFilterTaskStatus: (state) => {
			state.statusFilterList = [];
			if (state.where?.status) {
				delete state.where.status;
			}
		},
		filterByDueDate: (state, action: PayloadAction<PreselectedDatetimeRange>) => {
			state.filterDueDate = action.payload;
			const { from, to } = new DateTimeRange(action.payload).range;

			if (state.where) {
				state.where.due_date = { gte: from.toDate(), lte: to.toDate() };
			}
		},
		filterByStatus: (state, action: PayloadAction<task_statusType>) => {
			// For simplicity, we'll track the status filter list
			// directly in state. If the status is already in the list,
			// remove it, otherwise, add it

			if (state.statusFilterList.includes(action.payload)) {
				state.statusFilterList = state.statusFilterList.filter((s) => {
					return s !== action.payload;
				});
			} else {
				state.statusFilterList.push(action.payload);
			}

			// Update the `where` clause tracked in state

			if (state.where?.status && state.statusFilterList.length === 0) {
				delete state.where.status;
			} else if (state.where) {
				state.where.status = { in: state.statusFilterList };
			}
		},
		setOrderBy: (state, action: PayloadAction<OrderBy>) => {
			state.orderBy = action.payload;
		},
		setSelectedTasks: (state, action: PayloadAction<Selection>) => {
			state.selectedTasks = action.payload;
		},
	},
});

export const {
	clearFilterDueDate,
	clearFilterTaskStatus,
	filterByDueDate,
	filterByStatus,
	setOrderBy,
	setSelectedTasks,
} = taskManagement.actions;

export const selectSelectedTasks = (state: RootState) => {
	return state.taskManagementReducer.selectedTasks;
};
export const selectOrderBy = (state: RootState) => {
	return state.taskManagementReducer.orderBy;
};
export const selectWhere = (state: RootState) => {
	return state.taskManagementReducer.where;
};
export const selectStatusFilterList = (state: RootState) => {
	return state.taskManagementReducer.statusFilterList;
};
export const selectDueDateFilter = (state: RootState) => {
	return state.taskManagementReducer.filterDueDate;
};

export default taskManagement.reducer;

if (import.meta.vitest) {
	const { expect, it } = import.meta.vitest;

	it("filters by task status correctly", () => {
		let state = taskManagement.reducer(undefined, { type: "unknown" });
		expect(state).toEqual(initialState);

		// Adding a status to the filter list updates both the list and the `where` clause

		state = taskManagement.reducer(state, taskManagement.actions.filterByStatus("completed"));
		expect(state).toEqual({
			...initialState,
			statusFilterList: ["completed"],
			where: { status: { in: ["completed"] } },
		});

		// Adding the same status again removes it from the filter list and the `where` clause

		state = taskManagement.reducer(state, taskManagement.actions.filterByStatus("completed"));
		expect(state).toEqual(initialState);

		// Adding multiple statuses to the filter list updates both the list and the `where` clause

		state = taskManagement.reducer(state, taskManagement.actions.filterByStatus("completed"));
		state = taskManagement.reducer(state, taskManagement.actions.filterByStatus("in_progress"));
		expect(state).toEqual({
			...initialState,
			statusFilterList: ["completed", "in_progress"],
			where: { status: { in: ["completed", "in_progress"] } },
		});
	});
}
