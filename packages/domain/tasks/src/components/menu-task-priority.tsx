import type { task_priorityType as TaskPriority } from "@shared/electric-sql";

import { Button, Menu, Popover, Tooltip, TooltipTrigger } from "boondoggle";
import { useDispatch } from "react-redux";

import { useElectric } from "@shared/electric-sql";
import * as i18n from "@shared/i18n";

import { getPriorityString } from "../lib/strings";
import { defaultPriorityUpdated } from "../redux/create-tasks-slice";
import { IconTaskPriority } from "./icon-task-priority";

const PRIORITY_ITEMS: { id: TaskPriority; label: string }[] = [
	{
		id: "p0",
		label: i18n.p0,
	},
	{
		id: "p1",
		label: i18n.p1,
	},
	{
		id: "p2",
		label: i18n.p2,
	},
	{
		id: "p3",
		label: i18n.p3,
	},
];

export function MenuTaskPriority({ id, priority }: { id: string; priority: TaskPriority }) {
	const { db } = useElectric() || {};
	if (!db) {
		throw new Error("Electric client not found");
	}

	const dispatch = useDispatch();

	const updatePriority = async (id: string, p: TaskPriority) => {
		dispatch(defaultPriorityUpdated(p));
		await db.tasks.update({
			data: { priority: p, updated_at: new Date(Date.now()) },
			where: { id },
		});
	};

	return (
		<Menu.Trigger>
			<TooltipTrigger delay={1000}>
				<Button appearance="ghost" size="sm" square>
					<IconTaskPriority priority={priority} />
				</Button>
				<Tooltip placement="bottom">{getPriorityString(priority)}</Tooltip>
			</TooltipTrigger>

			<Popover placement="right top">
				<Menu.DropdownMenu disabledKeys={[priority]} selectedKeys={[priority]}>
					<Menu.Section>
						{PRIORITY_ITEMS.map((t) => {
							return (
								<Menu.Item
									icon={<IconTaskPriority priority={t.id} />}
									id={t.id}
									key={t.id}
									onAction={() => {
										void updatePriority(id, t.id);
									}}
								>
									{t.label}
								</Menu.Item>
							);
						})}
					</Menu.Section>
				</Menu.DropdownMenu>
			</Popover>
		</Menu.Trigger>
	);
}
