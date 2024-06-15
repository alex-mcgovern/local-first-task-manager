import type { PreselectedDatetimeRange } from "@shared/date";

import { FilterButton, Menu, Popover } from "boondoggle";
import { useDispatch, useSelector } from "react-redux";

import { date_range_last_7_days, date_range_last_30_days, date_range_last_90_days, date_range_last_day, date_range_last_hour, date_range_next_7_days, date_range_next_30_days, date_range_next_90_days, date_range_next_day, date_range_next_hour, due_date, status } from "@shared/i18n";
import {
	clearFilterDueDate,
	clearFilterTaskStatus,
	selectDueDateFilter,
	selectStatusFilterList,
} from "@shared/redux";
import { exhaustiveSwitchGuard } from "@shared/utils";

import { getStatusString } from "../lib/strings";
import { MenuTaskFilterDueDate, MenuTaskFilterStatus } from "./menu-task-filters";

function FilterControlTaskStatus() {
	const filters = useSelector(selectStatusFilterList);
	const dispatch = useDispatch();

	const filterLabel = filters.map(getStatusString).join(", ");

	if (filters.length === 0) {
		return null;
	}

	return (
		<FilterButton.Group isFilterApplied>
			<FilterButton.Label>{status}</FilterButton.Label>
			<Menu.Trigger>
				<FilterButton.Button>{filterLabel}</FilterButton.Button>
				<Popover>
					<MenuTaskFilterStatus />
				</Popover>
			</Menu.Trigger>

			<FilterButton.Remove
				onPress={() => {
					return dispatch(clearFilterTaskStatus());
				}}
			/>
		</FilterButton.Group>
	);
}

const getDateRangeString = (date_range: PreselectedDatetimeRange) => {
	switch (date_range) {
		case "last_30_days": {
			return date_range_last_30_days;
		}
		case "last_7_days": {
			return date_range_last_7_days;
		}
		case "last_90_days": {
			return date_range_last_90_days;
		}
		case "last_day": {
			return date_range_last_day;
		}
		case "last_hour": {
			return date_range_last_hour;
		}
		case "next_30_days": {
			return date_range_next_30_days;
		}
		case "next_7_days": {
			return date_range_next_7_days;
		}
		case "next_90_days": {
			return date_range_next_90_days;
		}
		case "next_day": {
			return date_range_next_day;
		}
		case "next_hour": {
			return date_range_next_hour;
		}
		default: {
			return exhaustiveSwitchGuard(date_range);
		}
	}
};

function FilterControlDueDate() {
	const filter = useSelector(selectDueDateFilter);
	const dispatch = useDispatch();

	if (!filter) {
		return null;
	}

	const filterLabel = getDateRangeString(filter);

	return (
		<FilterButton.Group isFilterApplied>
			<FilterButton.Label>{due_date}</FilterButton.Label>
			<Menu.Trigger>
				<FilterButton.Button>{filterLabel}</FilterButton.Button>
				<Popover>
					<MenuTaskFilterDueDate />
				</Popover>
			</Menu.Trigger>

			<FilterButton.Remove
				onPress={() => {
					return dispatch(clearFilterDueDate());
				}}
			/>
		</FilterButton.Group>
	);
}

export function ToolbarTaskFilters() {
	// const statusFilterList = useSelector(selectStatusFilterList);
	// const dispatch = useDispatch();

	return (
		<div className="flex align-center gap-2 pt-2 pb-2 pl-4 pr-4">
			<FilterControlTaskStatus />
			<FilterControlDueDate />
		</div>
	);
}
