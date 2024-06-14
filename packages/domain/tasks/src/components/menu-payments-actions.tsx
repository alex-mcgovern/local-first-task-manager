import { Button, Icon, Menu, Popover } from "boondoggle";
import React from "react";
import { faEllipsis } from "@fortawesome/pro-solid-svg-icons/faEllipsis";
import * as i18n from "@shared/i18n";
import { useElectric } from "@shared/electric-sql";

export function MenuTasksActions() {
	const { db } = useElectric()!;
	const clearTasks = async () => {
		await db.tasks.deleteMany();
	};

	return (
		<Menu.Trigger>
			<Button appearance="secondary" square>
				<Icon icon={faEllipsis} />
			</Button>
			<Popover placement="bottom right">
				<Menu.DropdownMenu>
					<Menu.Section>
						<Menu.Item onAction={clearTasks}>{i18n.delete_all_tasks}</Menu.Item>
					</Menu.Section>
				</Menu.DropdownMenu>
			</Popover>
		</Menu.Trigger>
	);
}
