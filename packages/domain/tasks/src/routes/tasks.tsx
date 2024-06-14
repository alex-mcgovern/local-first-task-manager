import { App, Table } from "boondoggle";
import { useEffect, useState } from "react";
import { useLiveQuery } from "electric-sql/react";
import { Tasks as Payment, useElectric } from "@shared/electric-sql";
import { DialogNewTask } from "../components/dialog-new-task";
import { MenuTasksActions } from "../components/menu-task-actions";
import { MenuTaskStatus } from "../components/menu-task-status";
import type { Selection } from "react-aria-components";

export function Tasks() {
	const { db } = useElectric()!;
	const { results } = useLiveQuery(db.tasks.liveMany());

	const [selectedTasks, setSelectedTasks] = useState<Selection>(new Set());
	console.debug("👉  selectedTasks:", selectedTasks);

	useEffect(() => {
		const syncTasks = async () => {
			// Resolves when the shape subscription has been established.
			const shape = await db.tasks.sync();

			// Resolves when the data has been synced into the local database.
			await shape.synced;
		};

		syncTasks();
	}, []);

	const tasks: Payment[] = results ?? [];

	return (
		<>
			<App.Main.Header>
				<h1 className="mr-auto">Tasks</h1>
				<MenuTasksActions
					key={Array.from(selectedTasks).length}
					selectedTasks={selectedTasks}
				/>
				<DialogNewTask />
			</App.Main.Header>
			<App.Main.Content>
				<Table.ResizableContainer>
					<Table.Root
						selectedKeys={selectedTasks}
						onSelectionChange={setSelectedTasks}
						selectionMode="multiple"
						aria-label="Tasks table"
					>
						<Table.Header>
							<Table.Row>
								<Table.Column isRowHeader sticky width={176}>
									Title
								</Table.Column>
								<Table.Column minWidth={160} sticky width="1fr">
									Status
								</Table.Column>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{tasks.map((t) => {
								return (
									<Table.Row href={`/tasks/${t.id}`} key={t.id} id={t.id}>
										<Table.Cell>
											<div className="flex gap-2 align-center">
												<MenuTaskStatus id={t.id} status={t.status} />
												{t.title}
											</div>
										</Table.Cell>
										<Table.Cell right>{t.status}</Table.Cell>
									</Table.Row>
								);
							})}
						</Table.Body>
					</Table.Root>
				</Table.ResizableContainer>
			</App.Main.Content>
		</>
	);
}
