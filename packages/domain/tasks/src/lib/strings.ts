import type {
	task_priorityType as TaskPriority,
	task_statusType as TaskStatus,
} from "@shared/electric-sql";

import * as i18n from "@shared/i18n";
import { exhaustiveSwitchGuard } from "@shared/utils";

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
			return i18n.p0;
		}
		case "p1": {
			return i18n.p1;
		}
		case "p2": {
			return i18n.p2;
		}
		case "p3": {
			return i18n.p3;
		}
		default: {
			return exhaustiveSwitchGuard(priority);
		}
	}
}
