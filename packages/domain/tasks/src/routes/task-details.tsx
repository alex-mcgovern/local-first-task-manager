import { useEffect } from "react";

import { App } from "boondoggle";

import { DrawerTaskDetails } from "../components/drawer-task-details";

export function TaskDetails({ id }: { id: string }) {
	const [_, setDrawer] = App.useDrawer();

	useEffect(() => {
		setDrawer(<DrawerTaskDetails id={id} />);
	}, [id, setDrawer]);

	return null;
}
