import { Button, Icon, Menu, Popover } from "boondoggle";
import { faEllipsis } from "@fortawesome/pro-solid-svg-icons/faEllipsis";
import * as i18n from "@shared/i18n";
import { useElectric } from "@shared/electric-sql";

export function MenuTaskActions({ id }: { id: string }) {
	const { db } = useElectric()!;

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
						<Menu.Item color="red" onAction={deleteSelectedTasks}>
							{i18n.delete_task}
						</Menu.Item>
					</Menu.Section>
				</Menu.DropdownMenu>
			</Popover>
		</Menu.Trigger>
	);
}
