import type { task_statusType as Status, Tasks as Task } from "@shared/electric-sql";

import { useEffect } from "react";

import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons/faCheckCircle";
import { faExclamationCircle } from "@fortawesome/pro-solid-svg-icons/faExclamationCircle";
import { Icon, Pill, Table } from "boondoggle";
import clsx from "clsx";
import { useLiveQuery } from "electric-sql/react";
import { useDispatch, useSelector } from "react-redux";

import { formatDateTime } from "@shared/date";
import { useElectric } from "@shared/electric-sql";
import { due_date, tasks_table, title } from "@shared/i18n";
import { selectSelectedTasks, selectWhere, setOrderBy, setSelectedTasks } from "@shared/redux";

import { MenuTaskActions } from "./menu-task-actions";
import { MenuTaskStatus } from "./menu-task-status";

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

	const { db } = useElectric() || {};
	if (!db) {
		throw new Error("Electric client not found");
	}
	// @ts-expect-error - ToDo: Figure out why TS shouting at me
	const { results } = useLiveQuery(db.tasks.liveMany({ where }));
	const tasks: Task[] = results ?? [];

	useEffect(() => {
		const syncTasks = async () => {
			// Resolves when the shape subscription has been established.
			const shape = await db.tasks.sync();

			// Resolves when the data has been synced into the local database.
			await shape.synced;
		};

		void syncTasks();
	}, [db.tasks]);

	return (
		<Table.ResizableContainer>
			<Table.Root
				aria-label={tasks_table}
				onSelectionChange={(v) => {
					return dispatch(setSelectedTasks(v));
				}}
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
				selectedKeys={selectedTasks}
				selectionMode="multiple"
			>
				<Table.Header>
					<Table.Row>
						<Table.Column allowsSorting id="title" isRowHeader sticky>
							{title}
						</Table.Column>
						<Table.Column allowsSorting id="due_date" right sticky width="1fr">
							{due_date}
						</Table.Column>
						<Table.Column right sticky width={48} />
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{tasks.map((t) => {
						return (
							<Table.Row href={`/tasks/${t.id}`} id={t.id} key={t.id}>
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
									className="color-gray"
									right
									textValue={t.due_date?.toISOString()}
								>
									{t.due_date ? (
										<DueDate date={t.due_date} status={t.status} />
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
