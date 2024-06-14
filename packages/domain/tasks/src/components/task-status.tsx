import { task_statusType, useElectric } from "@shared/electric-sql";
import { faCircleDot } from "@fortawesome/pro-solid-svg-icons/faCircleDot";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons/faCheckCircle";
import { faCircleHalfStroke } from "@fortawesome/pro-solid-svg-icons/faCircleHalfStroke";
import { Button, Icon, Menu, Popover, Tooltip, TooltipTrigger } from "boondoggle";
import { exhaustiveSwitchGuard } from "@shared/utils";
import * as i18n from "@shared/i18n";

function getIcon(status: task_statusType) {
	switch (status) {
		case "completed": {
			return faCheckCircle;
		}
		case "in_progress": {
			return faCircleHalfStroke;
		}
		case "to_do": {
			return faCircleDot;
		}
		default: {
			return exhaustiveSwitchGuard(status);
		}
	}
}

function getStr(status: task_statusType) {
	switch (status) {
		case "completed": {
			return i18n.status_completed;
		}
		case "in_progress": {
			return i18n.status_in_progress;
		}
		case "to_do": {
			return i18n.status_to_do;
		}
		default: {
			return exhaustiveSwitchGuard(status);
		}
	}
}

export function MenuTaskStatus({ status, id }: { status: task_statusType; id: string }) {
	const { db } = useElectric()!;

	const updateStatus = async (id: string, s: task_statusType) => {
		await db.tasks.update({
			where: { id },
			data: { status: s, updated_at: new Date(Date.now()) },
		});
	};

	return (
		<Menu.Trigger>
			<TooltipTrigger>
				<Button appearance="ghost" square size="sm">
					<Icon color="grey" icon={getIcon(status)} />
				</Button>
				<Tooltip placement="left">{getStr(status)}</Tooltip>
			</TooltipTrigger>
			<Popover placement="bottom left">
				<Menu.DropdownMenu>
					<Menu.Section>
						<Menu.Item
							icon={<Icon color="grey" icon={getIcon("to_do")} />}
							onAction={() => updateStatus(id, "to_do")}
							id="to_do"
						>
							{i18n.status_to_do}
						</Menu.Item>
						<Menu.Item
							icon={<Icon color="grey" icon={getIcon("in_progress")} />}
							onAction={() => updateStatus(id, "in_progress")}
							id="in_progress"
						>
							{i18n.status_in_progress}
						</Menu.Item>
						<Menu.Item
							icon={<Icon color="grey" icon={getIcon("completed")} />}
							onAction={() => updateStatus(id, "completed")}
							id="completed"
						>
							{i18n.status_completed}
						</Menu.Item>
					</Menu.Section>
				</Menu.DropdownMenu>
			</Popover>
		</Menu.Trigger>
	);
}
