import type { Tasks as Task } from "@shared/electric-sql";

/**
 * A utility type that checks if an array is an exhaustive list of all the keys of an object type.
 * Note: This may cause a lot of IDE slowdown. It may not be the smartest idea to do this.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- can't avoid using `any` here
type ExhaustiveArray<U extends string, R extends any[] = []> = {
	[S in U]: Exclude<U, S> extends never ? [...R, S] : ExhaustiveArray<Exclude<U, S>, [...R, S]>;
}[U];

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
