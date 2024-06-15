import type { task_statusType } from "@shared/electric-sql";

import { zodResolver } from "@hookform/resolvers/zod";
import { parseAbsoluteToLocal } from "@internationalized/date";
import {
	App,
	Button,
	ComboBoxButton,
	ComboBoxInput,
	DateInput,
	DatePicker,
	Form,
	FormComboBox,
	FormTextField,
	Group,
	Input,
	Label,
	TextArea,
} from "boondoggle";
import { useLiveQuery } from "electric-sql/react";
import { z } from "zod";

import { TasksSchema, useElectric } from "@shared/electric-sql";
import {
	created_at,
	description,
	status,
	status_completed,
	status_in_progress,
	status_to_do,
	task_details,
	title,
	updated_at,
} from "@shared/i18n";

import { IconTaskStatus } from "./icon-task-status";

const updateTaskSchema = TasksSchema.omit({
	created_at: true,
	id: true,
	title: true,
	updated_at: true,
}).merge(z.object({ title: z.string().min(1) }));
type UpdateTask = z.infer<typeof updateTaskSchema>;

export function DrawerTaskDetails({ id }: { id: string }) {
	const { db } = useElectric() || {};
	if (!db) {
		throw new Error("Electric client not found");
	}

	const { results: task } = useLiveQuery(db.tasks.liveUnique({ where: { id } }));

	if (!task) {
		return null;
	}

	const updateTask = async (t: Partial<UpdateTask>) => {
		await db.tasks.update({
			data: {
				description: t.description,
				status: t.status,
				title: t.title,
				updated_at: new Date(Date.now()),
			},
			where: { id },
		});
	};

	return (
		<Form<UpdateTask>
			// Ensure that if any value changes, the component re-renders
			key={Object.values(task).join("-")}
			onSubmit={updateTask}
			options={{
				resolver: zodResolver(updateTaskSchema),
				values: task,
			}}
		>
			<div className="flex gap-2">
				<h3>{task_details}</h3>
				<App.AppDrawer.CloseButton />
			</div>

			<hr />

			<FormTextField className="mb-4" name="title">
				<Label>{title}</Label>
				<Input />
			</FormTextField>

			<FormTextField className="mb-4" name="description">
				<Label>{description}</Label>
				<TextArea />
			</FormTextField>

			<FormComboBox<task_statusType>
				className="mb-4"
				items={[
					{
						id: "to_do",
						name: status_to_do,
						slotLeft: <IconTaskStatus status="to_do" />,
					},
					{
						id: "in_progress",
						name: status_in_progress,
						slotLeft: <IconTaskStatus status="in_progress" />,
					},
					{
						id: "completed",
						name: status_completed,
						slotLeft: <IconTaskStatus status="completed" />,
					},
				]}
				name="status"
			>
				<Label>{status}</Label>
				<Group>
					<ComboBoxInput unstyled />
					<ComboBoxButton />
				</Group>
			</FormComboBox>

			<Button type="submit">Submit</Button>

			<hr />

			<DatePicker
				className="mb-4"
				isReadOnly
				value={parseAbsoluteToLocal(task.created_at.toISOString())}
			>
				<Label>{created_at}</Label>
				<DateInput />
			</DatePicker>

			<DatePicker
				className="mb-4"
				isReadOnly
				value={parseAbsoluteToLocal(task.updated_at.toISOString())}
			>
				<Label>{updated_at}</Label>
				<DateInput />
			</DatePicker>
		</Form>
	);
}
