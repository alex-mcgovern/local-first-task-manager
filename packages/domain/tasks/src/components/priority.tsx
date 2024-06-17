import type { task_priorityType as TaskPriority } from "@shared/electric-sql";

import { Button, Menu, Popover, Tooltip, TooltipTrigger } from "boondoggle";
import { useDispatch } from "react-redux";

import { useElectric } from "@shared/electric-sql";

import { PRIORITY_MENU_ITEMS } from "../lib/priority";
import { getPriorityString } from "../lib/strings";
import { defaultPriorityUpdated } from "../redux/create-tasks-slice";
import { IconTaskPriority } from "./icon-task-priority";

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
						{PRIORITY_MENU_ITEMS.map((t) => {
							return (
								<Menu.Item
									icon={t.slotLeft}
									id={t.id}
									key={t.id}
									onAction={() => {
										void updatePriority(id, t.id);
									}}
								>
									{t.name}
								</Menu.Item>
							);
						})}
					</Menu.Section>
				</Menu.DropdownMenu>
			</Popover>
		</Menu.Trigger>
	);
}
