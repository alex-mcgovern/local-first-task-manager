import type { Color } from "boondoggle";

import type { ComponentProps } from "react";

import type { task_priorityType as TaskPriority } from "@shared/electric-sql";

import { faExclamationSquare } from "@fortawesome/pro-solid-svg-icons/faExclamationSquare";
import { faSquare1 } from "@fortawesome/pro-solid-svg-icons/faSquare1";
import { faSquare2 } from "@fortawesome/pro-solid-svg-icons/faSquare2";
import { faSquare3 } from "@fortawesome/pro-solid-svg-icons/faSquare3";
import { Icon } from "boondoggle";

import { exhaustiveSwitchGuard } from "@shared/utils";

function getIcon(priority: TaskPriority) {
	switch (priority) {
		case "p0": {
			return faExclamationSquare;
		}
		case "p1": {
			return faSquare1;
		}
		case "p2": {
			return faSquare2;
		}
		case "p3": {
			return faSquare3;
		}
		default: {
			return exhaustiveSwitchGuard(priority);
		}
	}
}

function getColor(priority: TaskPriority): Color {
	switch (priority) {
		case "p0": {
			return "red";
		}
		case "p1": {
			return "grey";
		}
		case "p2": {
			return "grey";
		}
		case "p3": {
			return "grey";
		}
		default: {
			return exhaustiveSwitchGuard(priority);
		}
	}
}

export function IconTaskPriority({
	color,
	priority,
	...props
}: { priority: TaskPriority } & Omit<ComponentProps<typeof Icon>, "icon">) {
	return (
		<Icon
			{...props}
			// Allow overriding the color
			color={color ? color : getColor(priority)}
			icon={getIcon(priority)}
		/>
	);
}
