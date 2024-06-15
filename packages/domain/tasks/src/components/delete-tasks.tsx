import { Button, Icon, Menu, Popover } from "boondoggle";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import * as i18n from "@shared/i18n";
import { useElectric } from "@shared/electric-sql";
import type { Selection } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedTasks, setSelectedTasks } from "@shared/redux";

function getDeleteLabel(selectedTasks: Selection) {
	if (selectedTasks === "all") {
		return i18n.delete_all;
	}
	return `${i18n.delete_selected} (${selectedTasks.size})`;
}

export function ButtonDeleteTasks() {
	const selectedTasks = useSelector(selectSelectedTasks);
	const dispatch = useDispatch();

	const { db } = useElectric()!;

	const deleteSelectedTasks = async () => {
		if (selectedTasks === "all") {
			await db.tasks.deleteMany();
		} else {
			await db.tasks.deleteMany({
				where: { id: { in: Array.from(selectedTasks).map((k) => k.toString()) } },
			});
		}
		// Clear the selection after deleting the tasks.
		dispatch(setSelectedTasks(new Set()));
	};

	const hasSelection: boolean = selectedTasks === "all" || selectedTasks.size > 0;

	if (!hasSelection) {
		return null;
	}

	return (
		<Button color="red" appearance="secondary" onPress={deleteSelectedTasks}>
			<Icon icon={faTrash} />
			{getDeleteLabel(selectedTasks)}
		</Button>
	);
}
