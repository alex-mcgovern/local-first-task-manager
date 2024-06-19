import type { IterableMenuItem } from "boondoggle";

import type { ReactNode } from "react";

import type { task_priorityType as TaskPriority } from "@shared/electric-sql";
import type { ExhaustiveArray } from "@shared/utils";

import { IconTaskPriority } from "../components/icon-task-priority";
import { getPriorityString } from "./strings";

export const PRIORITY_MENU_ITEMS: { id: TaskPriority; name: string; slotLeft: ReactNode }[] = (
	["p0", "p1", "p2", "p3"] satisfies ExhaustiveArray<TaskPriority>
).map((i) => {
	return {
		id: i,
		name: getPriorityString(i),
		slotLeft: <IconTaskPriority priority={i} />,
	};
}) satisfies IterableMenuItem<TaskPriority>[];
