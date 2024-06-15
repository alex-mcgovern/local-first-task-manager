import { selectSelectedTasks, setSelectedTasks, setOrderBy, selectWhere } from "@shared/redux";
import { Icon, Pill, Table } from "boondoggle";
import { useDispatch, useSelector } from "react-redux";
import * as i18n from "@shared/i18n";
import { faExclamationCircle } from "@fortawesome/pro-solid-svg-icons/faExclamationCircle";
import { formatDateTime } from "@shared/date";
import { MenuTaskActions } from "./menu-task-actions";
import { MenuTaskStatus } from "./menu-task-status";
import { useElectric, type Tasks as Task, task_statusType as Status } from "@shared/electric-sql";
import { useLiveQuery } from "electric-sql/react";
import { useEffect } from "react";
import clsx from "clsx";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons/faCheckCircle";

function DueDate({ date, status }: { date: Date; status: Status }) {
	const isOverdue = status !== "completed" && date < new Date();
	const isDone = status === "completed";

	return (
		<Pill className={isDone ? "line-through" : undefined} color={isOverdue ? "red" : undefined}>
			{isDone ? <Icon icon={faCheckCircle} /> : null}
			{isOverdue ? <Icon icon={faExclamationCircle} /> : null}
			{formatDateTime(date.toISOString())}
		</Pill>
	);
}

export function TableTasks() {
	const where = useSelector(selectWhere);
	const selectedTasks = useSelector(selectSelectedTasks);
	const dispatch = useDispatch();

	const { db } = useElectric()!;
	const { results } = useLiveQuery(db.tasks.liveMany({ where }));
	const tasks: Task[] = results ?? [];

	useEffect(() => {
		const syncTasks = async () => {
			// Resolves when the shape subscription has been established.
			const shape = await db.tasks.sync();

			// Resolves when the data has been synced into the local database.
			await shape.synced;
		};

		syncTasks();
	}, []);

	return (
		<Table.ResizableContainer>
			<Table.Root
				selectedKeys={selectedTasks}
				onSelectionChange={(v) => dispatch(setSelectedTasks(v))}
				selectionMode="multiple"
				aria-label={i18n.tasks_table}
				onSortChange={({ column, direction }) => {
					switch (column) {
						case "due_date": {
							return dispatch(
								setOrderBy({
									due_date: direction === "ascending" ? "asc" : "desc",
								}),
							);
						}
						case "title": {
							return dispatch(
								setOrderBy({
									title: direction === "ascending" ? "asc" : "desc",
								}),
							);
						}
						default: {
							return null;
						}
					}
				}}
			>
				<Table.Header>
					<Table.Row>
						<Table.Column allowsSorting id="title" isRowHeader sticky>
							{i18n.title}
						</Table.Column>
						<Table.Column id="due_date" allowsSorting right sticky width="1fr">
							{i18n.due_date}
						</Table.Column>
						<Table.Column right width={48} sticky />
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{tasks.map((t) => {
						return (
							<Table.Row href={`/tasks/${t.id}`} key={t.id} id={t.id}>
								<Table.Cell textValue={t.title}>
									<div
										className={clsx("flex gap-2 align-center", {
											"line-through color-gray": t.status === "completed",
										})}
									>
										<MenuTaskStatus id={t.id} status={t.status} />
										{t.title}
									</div>
								</Table.Cell>
								<Table.Cell
									textValue={t.due_date?.toISOString()}
									right
									className="color-gray"
								>
									{t.due_date ? (
										<DueDate status={t.status} date={t.due_date} />
									) : (
										"—"
									)}
								</Table.Cell>
								<Table.Cell right>
									<MenuTaskActions id={t.id} />
								</Table.Cell>
							</Table.Row>
						);
					})}
				</Table.Body>
			</Table.Root>
		</Table.ResizableContainer>
	);
}
