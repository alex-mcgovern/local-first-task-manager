import type { task_statusType } from "@shared/electric-sql";
import * as i18n from "@shared/i18n";
import { exhaustiveSwitchGuard } from "@shared/utils";

export function getStatusString(status: task_statusType) {
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
