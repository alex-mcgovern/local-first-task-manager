import type { ComponentProps } from "react";

import type { task_statusType } from "@shared/electric-sql";

import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons/faCheckCircle";
import { faCircleDot } from "@fortawesome/pro-solid-svg-icons/faCircleDot";
import { faCircleHalfStroke } from "@fortawesome/pro-solid-svg-icons/faCircleHalfStroke";
import { Icon } from "boondoggle";

import { exhaustiveSwitchGuard } from "@shared/utils";

function getIcon(status: task_statusType) {
	switch (status) {
		case "completed": {
			return faCheckCircle;
		}
		case "in_progress": {
			return faCircleHalfStroke;
		}
		case "to_do": {
			return faCircleDot;
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
}: { status: task_statusType } & Omit<ComponentProps<typeof Icon>, "icon">) {
	return <Icon {...props} color={color} icon={getIcon(status)} />;
}
