import { faEllipsis } from "@fortawesome/pro-solid-svg-icons/faEllipsis";
import { Button, Icon, Menu, Popover } from "boondoggle";
import { useElectric } from "@shared/electric-sql";
import * as i18n from "@shared/i18n";

export function MenuTaskActions({ id }: { id: string }) {
	const { db } = useElectric() || {};
	if (!db) {
		throw new Error("Electric client not found");
	}

	const deleteSelectedTasks = async () => {
		return db.tasks.delete({ where: { id } });
	};

	return (
		<Menu.Trigger>
			<Button appearance="ghost" square>
				<Icon icon={faEllipsis} />
			</Button>
			<Popover placement="bottom right">
				<Menu.DropdownMenu>
					<Menu.Section>
						<Menu.Item
							color="red"
							onAction={() => {
								return void deleteSelectedTasks();
							}}
						>
							{i18n.delete_task}
						</Menu.Item>
					</Menu.Section>
				</Menu.DropdownMenu>
			</Popover>
		</Menu.Trigger>
	);
}
