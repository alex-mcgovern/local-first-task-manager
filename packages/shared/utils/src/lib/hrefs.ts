export const home = "/";
export const task = (id: string) => {
	return `/tasks/${id}` as const;
};
export const tasks = "/tasks";
