import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
	createTaskDialogOpenChange,
	selectIsCreateTaskDialogOpen,
} from "../redux/create-tasks-slice";

/**
 * This hook listens for the "c" key to be pressed and opens the launch dialog.
 *
 * Note: In a production application, this would likely be expanded a global shortcut hook, that
 * could open any dialog from any point in the application. Which would mean moving it out of the
 * tasks domain and into a more global location.
 */
export function useLaunchDialog() {
	const is_create_task_dialog_open = useSelector(selectIsCreateTaskDialogOpen);
	const dispatch = useDispatch();

	return useEffect(() => {
		const documentListener = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement;
			if (
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.isContentEditable
			) {
				return;
			}

			if (!is_create_task_dialog_open && e.key === "c") {
				e.preventDefault();

				dispatch(createTaskDialogOpenChange(true));
			}
		};

		document.addEventListener("keydown", documentListener);

		return () => {
			document.removeEventListener("keydown", documentListener);
		};
	}, [dispatch, is_create_task_dialog_open]);
}
