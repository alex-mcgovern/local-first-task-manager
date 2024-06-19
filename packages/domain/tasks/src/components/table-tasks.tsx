// eslint-disable-next-line no-restricted-imports -- usually discourage direct import from `react-aria-components`, but this is necessary
import type { SortDescriptor } from "react-aria-components";

import type { Tasks as Task, task_statusType as TaskStatus } from "@shared/electric-sql";

import { useCallback, useEffect } from "react";

import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons/faCheckCircle";
import { faExclamationCircle } from "@fortawesome/pro-solid-svg-icons/faExclamationCircle";
import { Icon, Pill, Table } from "boondoggle";
import { useLiveQuery } from "electric-sql/react";
import { useDispatch, useSelector } from "react-redux";

import { formatDateTime } from "@shared/date";
import { useElectric } from "@shared/electric-sql";
import * as i18n from "@shared/i18n";

import { deserializeSelection, serializeSelection } from "../lib/serde";
import { isTaskKey } from "../lib/validation";
import { selectTaskFilterWhereClause } from "../redux/filter-tasks-slice";
import { selectTasksSelection, selectionUpdated } from "../redux/select-tasks-slice";
import {
	columnSorted,
	selectTasksOrderByClause,
	selectTasksSortDescriptor,
} from "../redux/sort-tasks-slice";
import { MenuTaskActions } from "./menu-task-actions";
import { MenuTaskStatus } from "./menu-task-status";
import { MenuTaskPriority } from "./priority";

function DueDate({ date, status }: { date: Date; status: TaskStatus }) {
	const isOverdue: boolean = status !== "completed" && date < new Date();
	const isDone = status === "completed";

	return (
		<Pill
			color={isOverdue ? "red" : undefined}
			data-overdue={isOverdue.toString()}
			data-testid="due-date"
		>
			{isDone ? <Icon icon={faCheckCircle} /> : null}
			{isOverdue ? <Icon icon={faExclamationCircle} /> : null}
			{formatDateTime(date.toISOString())}
		</Pill>
	);
}

/**
 * Hook to manage sorting of the tasks table.
 * @returns The current sort descriptor (required by react-aria-components Table) and a function to update the sort descriptor.
 */
function useTableSorting() {
	const dispatch = useDispatch();

	const sort_descriptor = useSelector(selectTasksSortDescriptor);

	const updateSort = useCallback(
		({ column, direction }: SortDescriptor) => {
			if (!column) {
				return;
			}

			const columnKey = column.toString();
			// Because we don't have type information on our columns, we need to runtime check
			// if the column is a valid task key before dispatching the action, else we'll be
			// wiring up each column manually.
			if (isTaskKey(columnKey)) {
				dispatch(
					columnSorted({
						column: columnKey,
						direction,
					}),
				);
			}
		},
		[dispatch],
	);

	return { sort_descriptor, updateSort };
}

function useDbTasks(): Task[] {
	const { db } = useElectric() || {};
	if (!db) {
		throw new Error("Electric client not found");
	}

	// Get the `where` and `orderBy` params from Redux to provide to the Electric SQL query
	const where = useSelector(selectTaskFilterWhereClause);
	const order_by = useSelector(selectTasksOrderByClause);

	// @ts-expect-error - ToDo: Figure out why TS shouting at me
	const { results } = useLiveQuery(db.tasks.liveMany({ orderBy: order_by, where }));

	useEffect(() => {
		const syncTasks = async () => {
			// Resolves when the shape subscription has been established.
			const shape = await db.tasks.sync();

			// Resolves when the data has been synced into the local database.
			await shape.synced;
		};

		void syncTasks();
	}, [db.tasks]);

	return results ?? [];
}

export function TableTasks() {
	const dispatch = useDispatch();
	const tasks = useDbTasks();
	const { sort_descriptor, updateSort } = useTableSorting();
	const selected_tasks = deserializeSelection(useSelector(selectTasksSelection));

	return (
		<Table.ResizableContainer>
			<Table.Root
				aria-label={i18n.tasks_table}
				onSelectionChange={(v) => {
					return dispatch(selectionUpdated(serializeSelection(v)));
				}}
				onSortChange={updateSort}
				selectedKeys={selected_tasks}
				selectionMode="multiple"
				sortDescriptor={sort_descriptor}
			>
				<Table.Header sticky>
					<Table.Column allowsSorting center id="priority" width={28}>
						{i18n.priority}
					</Table.Column>

					<Table.Column allowsSorting center id="status" width={28}>
						{i18n.status}
					</Table.Column>

					<Table.Column allowsSorting id="title" isRowHeader>
						{i18n.title}
					</Table.Column>

					<Table.Column allowsSorting id="due_date" right width="1fr">
						{i18n.due_date}
					</Table.Column>

					<Table.Column right width={48} />
				</Table.Header>

				<Table.Body>
					{tasks.map((t) => {
						return (
							<Table.Row href={`/tasks/${t.id}`} id={t.id} key={t.id}>
								<Table.Cell center textValue={t.priority}>
									<MenuTaskPriority id={t.id} priority={t.priority} />
								</Table.Cell>
								<Table.Cell center textValue={t.status}>
									<MenuTaskStatus id={t.id} status={t.status} />
								</Table.Cell>
								<Table.Cell textValue={t.title}>{t.title}</Table.Cell>
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
