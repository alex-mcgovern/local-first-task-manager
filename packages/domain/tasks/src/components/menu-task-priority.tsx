import type { task_priorityType as TaskPriority } from "@shared/electric-sql";

import { Button, Menu, Popover, Tooltip } from "boondoggle";
import { useDispatch } from "react-redux";

import { useElectric } from "@shared/electric-sql";

import { PRIORITY_MENU_ITEMS } from "../lib/priority-menu-items";
import { getPriorityString } from "../lib/strings";
import { defaultPriorityUpdated } from "../redux/create-tasks-slice";
import { IconTaskPriority } from "./icon-task-priority";

/**
 * A menu that is rendered on each table row, and allows quickly changing the task's priority.
 */
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
			<Tooltip.Root delay={1000}>
				<Button
					appearance="ghost"
					data-testid={`menu_priority_${priority}`}
					size="sm"
					square
				>
					<IconTaskPriority priority={priority} />
				</Button>
				<Tooltip.Body placement="bottom">{getPriorityString(priority)}</Tooltip.Body>
			</Tooltip.Root>

			<Popover.Root placement="right top">
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
			</Popover.Root>
		</Menu.Trigger>
	);
}
