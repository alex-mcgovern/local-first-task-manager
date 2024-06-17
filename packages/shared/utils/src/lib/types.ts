// A utility type that checks if an array is an exhaustive list all members of a union type.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- can't avoid using `any` here
export type ExhaustiveArray<U extends string, R extends any[] = []> = {
	[S in U]: Exclude<U, S> extends never ? [...R, S] : ExhaustiveArray<Exclude<U, S>, [...R, S]>;
}[U];
