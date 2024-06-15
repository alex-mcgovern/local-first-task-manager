// eslint-disable-next-line no-restricted-imports -- usually discourage direct import from `react-aria-components`, but this is necessary
import type { Selection } from "react-aria-components";

import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { Button, Icon } from "boondoggle";
import { useDispatch, useSelector } from "react-redux";

import { useElectric } from "@shared/electric-sql";
import * as i18n from "@shared/i18n";
import { selectSelectedTasks, setSelectedTasks } from "@shared/redux";

function getDeleteLabel(selectedTasks: Selection) {
	if (selectedTasks === "all") {
		return i18n.delete_all;
	}
	return `${i18n.delete_selected} (${selectedTasks.size})`;
}

export function ButtonDeleteTasks() {
	const selected = useSelector(selectSelectedTasks);
	const dispatch = useDispatch();

	const { db } = useElectric() || {};
	if (!db) {
		throw new Error("Electric client not found");
	}

	const deleteSelectedTasks = async () => {
		if (selected === "all") {
			await db.tasks.deleteMany();
		} else {
			await db.tasks.deleteMany({
				where: {
					id: {
						in: Array.from(selected).map((k) => {
							return k.toString();
						}),
					},
				},
			});
		}
		// Clear the selection after deleting the tasks.
		dispatch(setSelectedTasks(new Set()));
	};

	const hasSelection: boolean = selected === "all" || selected.size > 0;

	if (!hasSelection) {
		return null;
	}

	return (
		<Button
			appearance="secondary"
			color="red"
			onPress={() => {
				return void deleteSelectedTasks();
			}}
		>
			<Icon icon={faTrash} />
			{getDeleteLabel(selected)}
		</Button>
	);
}
