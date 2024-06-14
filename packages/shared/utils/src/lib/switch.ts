export function exhaustiveSwitchGuard(unhandled_case: never): never {
	console.error(`Received unhandled switch case ${unhandled_case as string}`);
	return null as never;
}
