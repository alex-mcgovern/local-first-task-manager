import type { Tasks as Task } from "@shared/electric-sql";
import type { ExhaustiveArray } from "@shared/utils";

const KEYS: ExhaustiveArray<keyof Task> = [
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
	return KEYS.includes(key as keyof Task);
};
