import { useEffect, useState } from "react";

import { App } from "boondoggle";
import { navigate } from "wouter/use-browser-location";

import { DrawerTaskDetails } from "../components/drawer-task-details";

export function TaskDetails({ id }: { id: string }) {
	const [is_open, setIsOpen] = useState(false);

	useEffect(() => {
		setIsOpen(true);
		return () => {
			return setIsOpen(false);
		};
	}, [id]);

	return (
		<App.Drawer.Root
			isOpen={is_open}
			onOpenChange={(o) => {
				setIsOpen(o);
				if (!o) {
					navigate("/");
				}
			}}
		>
			<DrawerTaskDetails id={id} />
		</App.Drawer.Root>
	);
}
