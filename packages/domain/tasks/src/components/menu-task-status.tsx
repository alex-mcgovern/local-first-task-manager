import type { task_statusType } from "@shared/electric-sql";

import { Button, Menu, Popover, Tooltip, TooltipTrigger } from "boondoggle";

import { useElectric } from "@shared/electric-sql";
import { status_completed, status_in_progress, status_to_do } from "@shared/i18n";

import { IconTaskStatus } from "../components/icon-task-status";
import { getStatusString } from "../lib/strings";

const STATUS_ITEMS: { id: task_statusType; label: string }[] = [
	{
		id: "to_do",
		label: status_to_do,
	},
	{
		id: "in_progress",
		label: status_in_progress,
	},
	{
		id: "completed",
		label: status_completed,
	},
];

export function MenuTaskStatus({ id, status }: { id: string; status: task_statusType }) {
	const { db } = useElectric() || {};
	if (!db) {
		throw new Error("Electric client not found");
	}

	const updateStatus = async (id: string, s: task_statusType) => {
		await db.tasks.update({
			data: { status: s, updated_at: new Date(Date.now()) },
			where: { id },
		});
	};

	return (
		<Menu.Trigger>
			<TooltipTrigger delay={1000}>
				<Button appearance="ghost" size="sm" square>
					<IconTaskStatus status={status} />
				</Button>
				<Tooltip placement="bottom">{getStatusString(status)}</Tooltip>
			</TooltipTrigger>
			<Popover placement="left top">
				<Menu.DropdownMenu disabledKeys={[status]} selectedKeys={[status]}>
					<Menu.Section>
						{STATUS_ITEMS.map((t) => {
							return (
								<Menu.Item
									icon={<IconTaskStatus status={t.id} />}
									id={t.id}
									key={t.id}
									onAction={() => {
										void updateStatus(id, t.id);
									}}
								/>
							);
						})}
					</Menu.Section>
				</Menu.DropdownMenu>
			</Popover>
		</Menu.Trigger>
	);
}
