import { TasksSchema, useElectric, task_statusType } from "@shared/electric-sql";
import {
	App,
	Button,
	ComboBoxButton,
	ComboBoxInput,
	Dialog,
	Form,
	FormComboBox,
	FormTextField,
	Group,
	Icon,
	Input,
	Label,
	TextArea,
} from "boondoggle";
import { genUUID } from "electric-sql/util";
import { z } from "zod";
import * as i18n from "@shared/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { faPlus } from "@fortawesome/pro-solid-svg-icons/faPlus";
import "../css/index.css";
import { IconTaskStatus } from "./icon-task-status";

const createTaskSchema = TasksSchema.omit({ created_at: true, updated_at: true, id: true });
type CreateTask = z.infer<typeof createTaskSchema>;

export function DialogNewTask() {
	const { db } = useElectric()!;
	const [_, setDrawer] = App.useDrawer();

	const addPayment = async (p: CreateTask) => {
		const date = new Date(Date.now());
		await db.tasks.create({
			data: {
				...p,
				id: genUUID(),
				created_at: date,
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
			<Dialog.ModalOverlay>
				<Dialog.Modal>
					<Form<CreateTask>
						onSubmit={addPayment}
						options={{
							resolver: zodResolver(createTaskSchema),
						}}
						onError={(e) => {
							console.error(e);
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

								<FormComboBox<task_statusType>
									items={[
										{
											slotLeft: <IconTaskStatus status="to_do" />,
											id: "to_do",
											name: i18n.status_to_do,
										},
										{
											slotLeft: <IconTaskStatus status="in_progress" />,
											id: "in_progress",
											name: i18n.status_in_progress,
										},
										{
											slotLeft: <IconTaskStatus status="completed" />,
											id: "completed",
											name: i18n.status_completed,
										},
									]}
									className="mb-4"
									name="status"
									defaultSelectedKey="to_do"
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
