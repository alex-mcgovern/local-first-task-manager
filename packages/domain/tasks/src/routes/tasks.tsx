import { App } from "boondoggle";

import * as i18n from "@shared/i18n";

import { ButtonDeleteTasks } from "../components/delete-tasks";
import { DialogNewTask } from "../components/dialog-new-task";
import { ToolbarTaskFilters } from "../components/filter-tasks";
import { TableTasks } from "../components/table-tasks";

/**
 * The main tasks route, responsible for rendering the task list,
 * allowing filtering, editing and viewing task details.
 */
export function Tasks() {
	return (
		<>
			<App.Main.Header>
				<div className="flex gap-2 mr-auto align-center">
					<h1>{i18n.tasks}</h1>
				</div>
				<ButtonDeleteTasks />
				<DialogNewTask />
			</App.Main.Header>
			<ToolbarTaskFilters />

			<App.Main.Content>
				<TableTasks />
			</App.Main.Content>
		</>
	);
}
