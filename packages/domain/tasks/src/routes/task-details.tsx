import { useEffect, useState } from "react";

import { App } from "boondoggle";
import { navigate } from "wouter/use-browser-location";

import { DrawerTaskDetails } from "../components/drawer-task-details";

/**
 * A route that displays the details of a task.
 *
 * Note: This is composed as a parallel route to the main app.
 * The content is rendered inline, in a slide-out drawer component, that
 * is built with an accessible <Dialog> primitive (from react-aria-components).
 *
 * Due to the above, we need to synchronize the drawer state when the route is mounted.
 * useEffect is a synchronization tool — often overused — but appropriate for this use case.
 */
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
