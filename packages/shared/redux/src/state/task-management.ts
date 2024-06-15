import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import type { Selection } from "react-aria-components";
import { TasksFindManyArgsSchema, task_statusType } from "@shared/electric-sql";
import { DateTimeRange, PreselectedDatetimeRange } from "@shared/date";

// Parameter for the `where` clause of the electric `tasks.findMany` query
type Where = Zod.infer<typeof TasksFindManyArgsSchema>["where"];

// Parameter for the `orderBy` clause of the electric `tasks.findMany` query
type OrderBy = Zod.infer<typeof TasksFindManyArgsSchema>["orderBy"];

interface State {
	selectedTasks: Selection;
	orderBy: OrderBy;
	where: Where;
	statusFilterList: task_statusType[];
	filterDueDate: PreselectedDatetimeRange | undefined;
}

const initialState: State = {
	selectedTasks: new Set(),
	orderBy: { created_at: "asc" },
	where: {},
	statusFilterList: [],
	filterDueDate: undefined,
};

export const taskManagement = createSlice({
	name: "taskManagement",
	initialState,
	reducers: {
		setOrderBy: (state, action: PayloadAction<OrderBy>) => {
			state.orderBy = action.payload;
		},
		filterByStatus: (state, action: PayloadAction<task_statusType>) => {
			// For simplicity, we'll track the status filter list
			// directly in state. If the status is already in the list,
			// remove it, otherwise, add it

			if (state.statusFilterList.includes(action.payload)) {
				state.statusFilterList = state.statusFilterList.filter((s) => s !== action.payload);
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
		filterByDueDate: (state, action: PayloadAction<PreselectedDatetimeRange>) => {
			state.filterDueDate = action.payload;
			const { from, to } = new DateTimeRange(action.payload).range;

			if (state.where) {
				state.where.due_date = { gte: from.toDate(), lte: to.toDate() };
			}
		},
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
		setSelectedTasks: (state, action: PayloadAction<Selection>) => {
			state.selectedTasks = action.payload;
		},
	},
});

export const {
	setSelectedTasks,
	setOrderBy,
	filterByStatus,
	clearFilterTaskStatus,
	filterByDueDate,
	clearFilterDueDate,
} = taskManagement.actions;

export const selectSelectedTasks = (state: RootState) => state.batchReducer.selectedTasks;
export const selectOrderBy = (state: RootState) => state.batchReducer.orderBy;
export const selectWhere = (state: RootState) => state.batchReducer.where;
export const selectStatusFilterList = (state: RootState) => state.batchReducer.statusFilterList;
export const selectDueDateFilter = (state: RootState) => state.batchReducer.filterDueDate;

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
