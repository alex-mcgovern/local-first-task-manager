import { App } from "boondoggle";

import { ButtonDeleteTasks } from "../components/delete-tasks";
import { DialogNewTask } from "../components/dialog-new-task";
import { ToolbarTaskFilters } from "../components/filter-tasks";
import { TableTasks } from "../components/table-tasks";

export function Tasks() {
	return (
		<>
			<App.Main.Header>
				<div className="flex gap-2 mr-auto align-center">
					<h1>Tasks</h1>
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
