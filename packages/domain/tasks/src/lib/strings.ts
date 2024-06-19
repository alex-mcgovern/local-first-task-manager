// Some simple functions to convert enums to strings for use throughout this domain.

import type { PreselectedDateTimeRange } from "@shared/date";
import type {
	task_priorityType as TaskPriority,
	task_statusType as TaskStatus,
} from "@shared/electric-sql";

import * as i18n from "@shared/i18n";
import { exhaustiveSwitchGuard } from "@shared/utils";

export const getDateRangeString = (date_range: PreselectedDateTimeRange) => {
	switch (date_range) {
		case "last_30_days": {
			return i18n.date_range_last_30_days;
		}
		case "last_7_days": {
			return i18n.date_range_last_7_days;
		}
		case "last_90_days": {
			return i18n.date_range_last_90_days;
		}
		case "last_day": {
			return i18n.date_range_last_day;
		}
		case "last_hour": {
			return i18n.date_range_last_hour;
		}
		case "next_30_days": {
			return i18n.date_range_next_30_days;
		}
		case "next_7_days": {
			return i18n.date_range_next_7_days;
		}
		case "next_90_days": {
			return i18n.date_range_next_90_days;
		}
		case "next_day": {
			return i18n.date_range_next_day;
		}
		case "next_hour": {
			return i18n.date_range_next_hour;
		}
		default: {
			return exhaustiveSwitchGuard(date_range);
		}
	}
};

export function getStatusString(status: TaskStatus) {
	switch (status) {
		case "completed": {
			return i18n.status_completed;
		}
		case "in_progress": {
			return i18n.status_in_progress;
		}
		case "to_do": {
			return i18n.status_to_do;
		}
		default: {
			return exhaustiveSwitchGuard(status);
		}
	}
}

export function getPriorityString(priority: TaskPriority) {
	switch (priority) {
		case "p0": {
			return i18n.priority_urgent;
		}
		case "p1": {
			return i18n.priority_high;
		}
		case "p2": {
			return i18n.priority_med;
		}
		case "p3": {
			return i18n.priority_low;
		}
		default: {
			return exhaustiveSwitchGuard(priority);
		}
	}
}
