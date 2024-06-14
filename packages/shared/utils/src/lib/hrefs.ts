export const home = "/" as const;
export const task = (id: string) => `/tasks/${id}` as const;
export const tasks = "/tasks" as const;