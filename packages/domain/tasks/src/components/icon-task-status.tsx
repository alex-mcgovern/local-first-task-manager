import type { ComponentProps } from "react";

import type { task_statusType as TaskStatus } from "@shared/electric-sql";

import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons/faCheckCircle";
import { faCircleDashed } from "@fortawesome/pro-solid-svg-icons/faCircleDashed";
import { faCircleHalfStroke } from "@fortawesome/pro-solid-svg-icons/faCircleHalfStroke";
import { Icon } from "boondoggle";

import { exhaustiveSwitchGuard } from "@shared/utils";

function getIcon(status: TaskStatus) {
	switch (status) {
		case "completed": {
			return faCheckCircle;
		}
		case "in_progress": {
			return faCircleHalfStroke;
		}
		case "to_do": {
			return faCircleDashed;
		}
		default: {
			return exhaustiveSwitchGuard(status);
		}
	}
}

export function IconTaskStatus({
	color = "grey",
	status,
	...props
}: { status: TaskStatus } & Omit<ComponentProps<typeof Icon>, "icon">) {
	return <Icon {...props} color={color} icon={getIcon(status)} />;
}
