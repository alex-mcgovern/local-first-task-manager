import { Icon } from "boondoggle";
import React from "react";
import { ComponentProps } from "react";
import { task_statusType } from "@shared/electric-sql";
import { faCircleDot } from "@fortawesome/pro-solid-svg-icons/faCircleDot";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons/faCheckCircle";
import { faCircleHalfStroke } from "@fortawesome/pro-solid-svg-icons/faCircleHalfStroke";
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

export const IconTaskStatus = ({
	status,
	color = "grey",
	...props
}: { status: task_statusType } & Omit<ComponentProps<typeof Icon>, "icon">) => {
	return <Icon {...props} color={color} icon={getIcon(status)} />;
};
