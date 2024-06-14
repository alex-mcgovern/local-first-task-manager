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
import { TasksSchema, useElectric, task_statusType } from "@shared/electric-sql";
import { z } from "zod";
import * as i18n from "@shared/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { useLiveQuery } from "electric-sql/react";

const updateTaskSchema = TasksSchema.omit({
	created_at: true,
	updated_at: true,
	id: true,
	title: true,
}).merge(z.object({ title: z.string().min(1) }));
type UpdateTask = z.infer<typeof updateTaskSchema>;

export function DrawerTaskDetails({ id }: { id: string }) {
	const { db } = useElectric()!;

	const { results: task } = useLiveQuery(db.tasks.liveUnique({ where: { id } }))!;

	if (!task) {
		return null;
	}

	const updateTask = async (t: Partial<UpdateTask>) => {
		await db.tasks.update({
			where: { id },
			data: {
				status: t.status,
				updated_at: new Date(Date.now()),
				description: t.description,
				title: t.title,
			},
		});
	};

	return (
		<Form<UpdateTask>
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
				items={[
					{ id: "to_do", name: i18n.status_to_do },
					{ id: "in_progress", name: i18n.status_in_progress },
					{ id: "completed", name: i18n.status_completed },
				]}
				className="mb-4"
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
				value={parseAbsoluteToLocal(task.created_at.toISOString())}
				isReadOnly
			>
				<Label>{i18n.created_at}</Label>
				<DateInput />
			</DatePicker>

			<DatePicker
				className="mb-4"
				value={parseAbsoluteToLocal(task.updated_at.toISOString())}
				isReadOnly
			>
				<Label>{i18n.updated_at}</Label>
				<DateInput />
			</DatePicker>
		</Form>
	);
}
