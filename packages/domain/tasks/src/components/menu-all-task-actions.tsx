// eslint-disable-next-line no-restricted-imports -- usually discourage direct import from `react-aria-components`, but this is necessary
import type { Selection } from "react-aria-components";

import { faEllipsis } from "@fortawesome/pro-solid-svg-icons/faEllipsis";
import { Button, Icon, Menu, Popover } from "boondoggle";

import { useElectric } from "@shared/electric-sql";
import { delete_all, delete_selected } from "@shared/i18n";

function getDeleteLabel(selectedTasks: Selection) {
	if (selectedTasks === "all") {
		return delete_all;
	}
	return `${delete_selected} (${selectedTasks.size})`;
}

export function MenuAllTaskActions({ selectedTasks }: { selectedTasks: Selection }) {
	const { db } = useElectric() || {};
	if (!db) {
		throw new Error("Electric client not found");
	}

	const deleteSelectedTasks = async () => {
		if (selectedTasks === "all") {
			return db.tasks.deleteMany();
		} else {
			return db.tasks.deleteMany({
				where: {
					id: {
						in: Array.from(selectedTasks).map((k) => {
							return k.toString();
						}),
					},
				},
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
							onAction={() => {
								return void deleteSelectedTasks();
							}}
						>
							{getDeleteLabel(selectedTasks)}
						</Menu.Item>
					</Menu.Section>
				</Menu.DropdownMenu>
			</Popover>
		</Menu.Trigger>
	);
}
