import { App, Table } from "boondoggle";
import { useEffect } from "react";
import { useLiveQuery } from "electric-sql/react";
import { Tasks as Payment, useElectric } from "@shared/electric-sql";
import { DialogNewTask } from "../components/dialog-new-task";
import { MenuTasksActions } from "../components/menu-payments-actions";
import { MenuTaskStatus } from "../components/task-status";
import { DrawerTaskDetails } from "../components/drawer-task-details";

export function Tasks() {
	const { db } = useElectric()!;
	const { results } = useLiveQuery(db.tasks.liveMany());
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setDrawer] = App.useDrawer();

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
				<MenuTasksActions />
				<DialogNewTask />
			</App.Main.Header>
			<App.Main.Content>
				<Table.ResizableContainer>
					<Table.Root selectionMode="multiple" aria-label="Tasks table">
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
							{tasks.map((p) => {
								return (
									<Table.Row
										onAction={() => setDrawer(<DrawerTaskDetails id={p.id} />)}
										key={p.id}
									>
										<Table.Cell>
											<div className="flex gap-2 align-center">
												<MenuTaskStatus id={p.id} status={p.status} />
												{p.title}
											</div>
										</Table.Cell>
										<Table.Cell right>{p.status}</Table.Cell>
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
