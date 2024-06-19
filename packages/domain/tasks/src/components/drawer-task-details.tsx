import type { ZonedDateTime } from "@internationalized/date";

import type {
	task_priorityType as TaskPriority,
	task_statusType as TaskStatus,
} from "@shared/electric-sql";

import { zodResolver } from "@hookform/resolvers/zod";
import { fromDate, getLocalTimeZone, parseAbsoluteToLocal } from "@internationalized/date";
import {
	App,
	Button,
	ComboBoxButton,
	ComboBoxInput,
	DateInput,
	DatePicker,
	DatePickerButton,
	DatePickerClearButton,
	DatePickerPreset,
	Form,
	FormComboBox,
	FormDatePicker,
	FormTextField,
	Grid,
	Group,
	Input,
	Label,
	TextArea,
} from "boondoggle";
import { useLiveQuery } from "electric-sql/react";
import { useDispatch } from "react-redux";
import { z } from "zod";

import { TasksSchema, useElectric } from "@shared/electric-sql";
import * as i18n from "@shared/i18n";

import { PRIORITY_MENU_ITEMS } from "../lib/priority";
import { isPriorityKey } from "../lib/validation";
import { defaultPriorityUpdated } from "../redux/create-tasks-slice";
import { IconTaskStatus } from "./icon-task-status";

const updateTaskSchema = TasksSchema.omit({
	created_at: true,
	due_date: true,
	id: true,
	updated_at: true,
}).merge(
	z.object({
		// We have to intercept the `ZonedDateTime` object used
		// by react-aria-components and convert it to a `Date`
		due_date: z.custom<ZonedDateTime>().nullable(),
	}),
);
type UpdateTask = z.infer<typeof updateTaskSchema>;

export function DrawerTaskDetails({ id }: { id: string }) {
	const { db } = useElectric() || {};
	if (!db) {
		throw new Error("Electric client not found");
	}

	const dispatch = useDispatch();

	const { results: task } = useLiveQuery(
		db.tasks.liveUnique({
			where: { id },
		}),
	);

	if (!task) {
		return null;
	}

	const updateTask = async (t: UpdateTask) => {
		await db.tasks.update({
			data: { ...t, due_date: t.due_date ? t.due_date.toDate() : null },
			where: { id },
		});
	};

	return (
		<Form<UpdateTask>
			key={Object.values(task).join("-")} // Ensure that if any value changes, the component re-renders
			onSubmit={updateTask}
			options={{
				resolver: zodResolver(updateTaskSchema),
				values: {
					description: task.description,
					due_date: task.due_date ? fromDate(task.due_date, getLocalTimeZone()) : null,
					priority: task.priority,
					status: task.status,
					title: task.title,
				},
			}}
		>
			<App.Drawer.Header>
				<h3>{i18n.task_details}</h3>
				<App.Drawer.CloseButton />
			</App.Drawer.Header>

			<App.Drawer.Content>
				<FormTextField className="mb-4" name="title">
					<Label>{i18n.title}</Label>
					<Input />
				</FormTextField>

				<FormTextField className="mb-4" name="description">
					<Label>{i18n.description}</Label>
					<TextArea />
				</FormTextField>

				<FormDatePicker className="mb-4" data-testid="due_date" name="due_date">
					<Label>{i18n.due_date}</Label>
					<Group>
						<DateInput unstyled />
						<DatePickerClearButton />
						<DatePickerButton />
					</Group>
					<Grid className="mt-2" columns={3}>
						<DatePickerPreset
							date={fromDate(new Date(), getLocalTimeZone()).set({
								hour: 18,
								millisecond: 0,
								minute: 0,
								second: 0,
							})}
						>
							{i18n.date_preset_today}
						</DatePickerPreset>
						<DatePickerPreset
							date={fromDate(new Date(), getLocalTimeZone()).add({ days: 1 }).set({
								hour: 18,
								millisecond: 0,
								minute: 0,
								second: 0,
							})}
						>
							{i18n.date_preset_tomorrow}
						</DatePickerPreset>
						<DatePickerPreset
							date={fromDate(new Date(), getLocalTimeZone()).add({ weeks: 1 }).set({
								hour: 18,
								millisecond: 0,
								minute: 0,
								second: 0,
							})}
						>
							{i18n.date_preset_1_week}
						</DatePickerPreset>
					</Grid>
				</FormDatePicker>

				<hr />

				<FormComboBox<TaskPriority>
					className="mb-4"
					defaultItems={PRIORITY_MENU_ITEMS}
					name="priority"
					onSelectionChange={(p) => {
						// A quirk of react-aria-components combobox and
						// Boondoggle's implementation means we lose type
						// info on the key — I've been meaning to open a PR.
						const k = p?.toString();
						if (k && isPriorityKey(k)) {
							dispatch(defaultPriorityUpdated(k));
						}
					}}
				>
					<Label>{i18n.priority}</Label>
					<Group>
						<ComboBoxInput unstyled />
						<ComboBoxButton />
					</Group>
				</FormComboBox>

				<FormComboBox<TaskStatus>
					className="mb-4"
					defaultItems={[
						{
							id: "to_do",
							name: i18n.status_to_do,
							slotLeft: <IconTaskStatus status="to_do" />,
						},
						{
							id: "in_progress",
							name: i18n.status_in_progress,
							slotLeft: <IconTaskStatus status="in_progress" />,
						},
						{
							id: "completed",
							name: i18n.status_completed,
							slotLeft: <IconTaskStatus status="completed" />,
						},
					]}
					name="status"
				>
					<Label>{i18n.status}</Label>
					<Group>
						<ComboBoxInput unstyled />
						<ComboBoxButton />
					</Group>
				</FormComboBox>

				<div className="flex gap-2 justify-end">
					<Button type="submit">{i18n.update}</Button>
				</div>

				<hr />

				<DatePicker
					className="mb-4"
					isReadOnly
					value={parseAbsoluteToLocal(task.created_at.toISOString())}
				>
					<Label>{i18n.created_at}</Label>
					<DateInput />
				</DatePicker>

				<DatePicker
					className="mb-4"
					isReadOnly
					value={parseAbsoluteToLocal(task.updated_at.toISOString())}
				>
					<Label>{i18n.updated_at}</Label>
					<DateInput />
				</DatePicker>
			</App.Drawer.Content>
		</Form>
	);
}
