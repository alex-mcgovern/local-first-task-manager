// Because of how `react-aria-components` (An Adobe open source UI library) <Table> component works, we lose type information
// on column IDs. These type predicates are simple runtime checks that help fill this gap.
//
// Aside: I believe this problem is fixable in `react-aria-components` with generics, and
// have been meaning to open a PR (or at least an issue) to address this.

import type { Tasks as Task, task_priorityType as TaskPriority } from "@shared/electric-sql";
import type { ExhaustiveArray } from "@shared/utils";

const TASK_KEYS: ExhaustiveArray<keyof Task> = [
	"id",
	"title",
	"description",
	"status",
	"priority",
	"due_date",
	"created_at",
	"updated_at",
];

export const isTaskKey = (key: string): key is keyof Task => {
	return TASK_KEYS.includes(key as keyof Task);
};

const PRIORITY_KEYS: ExhaustiveArray<TaskPriority> = ["p0", "p1", "p2", "p3"];

export const isPriorityKey = (key: string): key is TaskPriority => {
	return PRIORITY_KEYS.includes(key as TaskPriority);
};
