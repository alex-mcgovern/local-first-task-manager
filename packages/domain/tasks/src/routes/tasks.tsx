import { App } from "boondoggle";
import { ButtonDeleteTasks } from "../components/delete-tasks";
import { DialogNewTask } from "../components/dialog-new-task";
import { MenuTaskFilters } from "../components/menu-task-filters";
import { TableTasks } from "../components/table-tasks";
import { ToolbarTaskFilters } from "../components/toolbar-task-filters";

export function Tasks() {
	return (
		<>
			<App.Main.Header>
				<div className="flex gap-2 mr-auto">
					<h1>Tasks</h1>
					<MenuTaskFilters />
				</div>
				<ButtonDeleteTasks />
				<DialogNewTask />
			</App.Main.Header>

			<App.Main.Content>
				<ToolbarTaskFilters />
				<TableTasks />
			</App.Main.Content>
		</>
	);
}
