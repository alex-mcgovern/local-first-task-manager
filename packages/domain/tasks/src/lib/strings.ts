import type { task_statusType } from "@shared/electric-sql";

import { status_completed, status_in_progress, status_to_do } from "@shared/i18n";
import { exhaustiveSwitchGuard } from "@shared/utils";

export function getStatusString(status: task_statusType) {
	switch (status) {
		case "completed": {
			return status_completed;
		}
		case "in_progress": {
			return status_in_progress;
		}
		case "to_do": {
			return status_to_do;
		}
		default: {
			return exhaustiveSwitchGuard(status);
		}
	}
}
