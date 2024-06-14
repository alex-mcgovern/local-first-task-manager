import { App } from "boondoggle";
import { DrawerTaskDetails } from "../components/drawer-task-details";
import { useEffect } from "react";

export function TaskDetails({ id }: { id: string }) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setDrawer] = App.useDrawer();

	useEffect(() => {
		setDrawer(<DrawerTaskDetails id={id} />);
	}, [id, setDrawer]);

	return null;
}
