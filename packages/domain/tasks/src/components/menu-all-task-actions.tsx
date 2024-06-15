import { Button, Icon, Menu, Popover } from "boondoggle";
import { faEllipsis } from "@fortawesome/pro-solid-svg-icons/faEllipsis";
import * as i18n from "@shared/i18n";
import { useElectric } from "@shared/electric-sql";
import type { Selection } from "react-aria-components";

function getDeleteLabel(selectedTasks: Selection) {
	if (selectedTasks === "all") {
		return i18n.delete_all;
	}
	return `${i18n.delete_selected} (${selectedTasks.size})`;
}

export function MenuAllTaskActions({ selectedTasks }: { selectedTasks: Selection }) {
	const { db } = useElectric()!;

	const deleteSelectedTasks = async () => {
		if (selectedTasks === "all") {
			return db.tasks.deleteMany();
		} else {
			return db.tasks.deleteMany({
				where: { id: { in: Array.from(selectedTasks).map((k) => k.toString()) } },
			});
		}
	};

	const hasSelection: boolean = selectedTasks === "all" || selectedTasks.size > 0;

	return (
		<Menu.Trigger>
			<Button appearance="secondary" square>
				<Icon icon={faEllipsis} />
			</Button>
			<Popover placement="bottom right">
				<Menu.DropdownMenu>
					<Menu.Section>
						<Menu.Item
							color={hasSelection ? "red" : undefined}
							isDisabled={!hasSelection}
							onAction={deleteSelectedTasks}
						>
							{getDeleteLabel(selectedTasks)}
						</Menu.Item>
					</Menu.Section>
				</Menu.DropdownMenu>
			</Popover>
		</Menu.Trigger>
	);
}
