import type { task_statusType } from "@shared/electric-sql";

import { faPlus } from "@fortawesome/pro-solid-svg-icons/faPlus";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	ComboBoxButton,
	ComboBoxInput,
	DateInput,
	DatePickerButton,
	Dialog,
	Form,
	FormComboBox,
	FormDatePicker,
	FormTextField,
	Group,
	Icon,
	Input,
	Label,
	TextArea,
} from "boondoggle";
import { genUUID } from "electric-sql/util";
import { z } from "zod";

import { TasksSchema, useElectric } from "@shared/electric-sql";
import * as i18n from "@shared/i18n";

import { IconTaskStatus } from "./icon-task-status";

import "../css/index.css";

const createTaskSchema = TasksSchema.omit({
	created_at: true,
	description: true,
	due_date: true,
	id: true,
	updated_at: true,
}).merge(
	z.object({
		description: z.string().optional(),
		due_date: z.coerce.date().optional(),
	}),
);
type CreateTask = z.infer<typeof createTaskSchema>;

export function DialogNewTask() {
	const { db } = useElectric() || {};
	if (!db) {
		throw new Error("Electric client not found");
	}

	const addPayment = async (p: CreateTask) => {
		const date = new Date(Date.now());
		await db.tasks.create({
			data: {
				...p,
				created_at: date,
				id: genUUID(),
				updated_at: date,
			},
		});
	};

	return (
		<Dialog.Trigger>
			<Button>
				<Icon icon={faPlus} />
				{i18n.new_task}
			</Button>
			<Dialog.ModalOverlay isDismissable>
				<Dialog.Modal>
					<Form<CreateTask>
						onError={(e) => {
							console.error(e);
						}}
						onSubmit={addPayment}
						options={{
							defaultValues: {
								status: "to_do",
							},
							resolver: zodResolver(createTaskSchema),
						}}
					>
						<Dialog.Root>
							<Dialog.Header>
								<Dialog.Title>{i18n.new_task}</Dialog.Title>
								<Dialog.CloseButton />
							</Dialog.Header>
							<Dialog.Content>
								<FormTextField autoFocus className="mb-4" name="title">
									<Label>{i18n.title}</Label>
									<Input />
								</FormTextField>

								<FormTextField className="mb-4" name="description">
									<Label>{i18n.description}</Label>
									<TextArea />
								</FormTextField>

								<FormDatePicker
									className="mb-4"
									granularity="minute"
									name="due_date"
								>
									<Label>{i18n.due_date}</Label>
									<Group>
										<DateInput unstyled />
										<DatePickerButton />
									</Group>
								</FormDatePicker>

								<hr />

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
							</Dialog.Content>

							<Dialog.Footer>
								<Button type="submit">Submit</Button>
							</Dialog.Footer>
						</Dialog.Root>
					</Form>
				</Dialog.Modal>
			</Dialog.ModalOverlay>
		</Dialog.Trigger>
	);
}
