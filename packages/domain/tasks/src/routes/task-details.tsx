import { useEffect, useState } from "react";

import { App, DialogTrigger } from "boondoggle";
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
		<DialogTrigger
			isOpen={is_open}
			onOpenChange={(o) => {
				setIsOpen(o);
				if (!o) {
					navigate("/");
				}
			}}
		>
			<App.Drawer.Root>
				<DrawerTaskDetails id={id} />
			</App.Drawer.Root>
		</DialogTrigger>
	);
}
