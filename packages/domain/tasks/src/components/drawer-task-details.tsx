import type { z } from "zod";

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

import { TasksSchema, useElectric } from "@shared/electric-sql";
import * as i18n from "@shared/i18n";

import { IconTaskStatus } from "./icon-task-status";

const updateTaskSchema = TasksSchema.omit({
	created_at: true,
	id: true,
	updated_at: true,
});
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
			key={Object.values(task).join("-")} // Ensure that if any value changes, the component re-renders
			onSubmit={updateTask}
			options={{
				resolver: zodResolver(updateTaskSchema),
				values: task,
			}}
		>
			<div className="flex gap-2">
				<h3>{i18n.task_details}</h3>
				<App.AppDrawer.CloseButton />
			</div>

			<hr />

			<FormTextField className="mb-4" name="title">
				<Label>{i18n.title}</Label>
				<Input />
			</FormTextField>

			<FormTextField className="mb-4" name="description">
				<Label>{i18n.description}</Label>
				<TextArea />
			</FormTextField>

			<FormComboBox<task_statusType>
				className="mb-4"
				items={[
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

			<Button type="submit">Submit</Button>

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
		</Form>
	);
}
