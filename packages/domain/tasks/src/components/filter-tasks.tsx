import type { PreselectedDateTimeRange } from "@shared/date";
import type { task_statusType as TaskStatus } from "@shared/electric-sql";

import { faClockRotateLeft } from "@fortawesome/pro-solid-svg-icons/faClockRotateLeft";
import { faFilterList } from "@fortawesome/pro-solid-svg-icons/faFilterList";
import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import {
	App,
	Button,
	FilterButton,
	Icon,
	Menu,
	Popover,
	Tooltip,
	TooltipTrigger,
} from "boondoggle";
import { useDispatch, useSelector } from "react-redux";

import * as i18n from "@shared/i18n";

import { getDateRangeString, getStatusString } from "../lib/strings";
import {
	dueDateFilterApplied,
	dueDateFilterCleared,
	selectAreTasksFiltered,
	selectTaskFilterDueDate,
	selectTaskFilterStatus,
	statusFilterApplied,
	statusFilterCleared,
} from "../redux/filter-tasks-slice";
import { IconTaskStatus } from "./icon-task-status";

/**
 * A group of elements, showing the current state of
 * the "status" filter, and options to update or remove it.
 */
function FilterControlTaskStatus() {
	const filters = useSelector(selectTaskFilterStatus);
	const dispatch = useDispatch();

	const filterLabel = filters.map(getStatusString).join(", ");

	if (filters.length === 0) {
		return null;
	}

	return (
		<FilterButton.Group isFilterApplied>
			<FilterButton.Label>{i18n.status}</FilterButton.Label>
			<Menu.Trigger>
				<FilterButton.Button>{filterLabel}</FilterButton.Button>
				<Popover>
					<MenuTaskFilterStatus />
				</Popover>
			</Menu.Trigger>

			<FilterButton.Remove
				onPress={() => {
					return dispatch(statusFilterCleared());
				}}
			/>
		</FilterButton.Group>
	);
}

/**
 * A group of elements, showing the current state of
 * the "due date" filter, and options to update or remove it.
 */
function FilterControlDueDate() {
	const filter = useSelector(selectTaskFilterDueDate);
	const dispatch = useDispatch();

	if (!filter) {
		return null;
	}

	const filterLabel = getDateRangeString(filter);

	return (
		<FilterButton.Group isFilterApplied>
			<FilterButton.Label>{i18n.due_date}</FilterButton.Label>
			<Menu.Trigger>
				<FilterButton.Button>{filterLabel}</FilterButton.Button>
				<Popover>
					<MenuTaskFilterDueDate />
				</Popover>
			</Menu.Trigger>

			<FilterButton.Remove
				onPress={() => {
					return dispatch(dueDateFilterCleared());
				}}
			/>
		</FilterButton.Group>
	);
}

/**
 * A dropdown menu for filtering all tasks by "status".
 * Triggered either from the menu of all available filters,
 * or from the button showing the state of this filter.
 */

const STATUS_MENU_ITEMS: { id: TaskStatus; label: string }[] = [
	{ id: "to_do", label: i18n.status_to_do },
	{ id: "in_progress", label: i18n.status_in_progress },
	{ id: "completed", label: i18n.status_completed },
];

function MenuTaskFilterStatus() {
	const activeFilters = useSelector(selectTaskFilterStatus);
	const dispatch = useDispatch();

	return (
		<Menu.DropdownMenu
			aria-label={i18n.filter_by_status}
			selectedKeys={activeFilters}
			selectionMode="multiple"
		>
			<Menu.Section>
				{STATUS_MENU_ITEMS.map(({ id, label }) => {
					return (
						<Menu.Item
							icon={<IconTaskStatus status={id} />}
							id={id}
							key={id}
							onAction={() => {
								return dispatch(statusFilterApplied(id));
							}}
						>
							{label}
						</Menu.Item>
					);
				})}
			</Menu.Section>
			<Menu.Section>
				<Menu.Item
					color="red"
					hideCheckbox
					icon={<Icon color="red" icon={faTimes} />}
					id="clear_filters"
					isDisabled={activeFilters.length === 0}
					onAction={() => {
						dispatch(statusFilterCleared());
					}}
				>
					{i18n.clear_filters}
				</Menu.Item>
			</Menu.Section>
		</Menu.DropdownMenu>
	);
}

/**
 * A dropdown menu for filtering all tasks by "due date".
 * Triggered either from the menu of all available filters,
 * or from the button showing the state of this filter.
 */

const DUE_DATE_PAST_ITEMS: { id: PreselectedDateTimeRange; label: string }[] = [
	{ id: "last_hour", label: i18n.date_range_last_hour },
	{ id: "last_day", label: i18n.date_range_last_day },
	{ id: "last_7_days", label: i18n.date_range_last_7_days },
	{ id: "last_90_days", label: i18n.date_range_last_90_days },
];

const DUE_DATE_FUTURE_ITEMS: { id: PreselectedDateTimeRange; label: string }[] = [
	{ id: "next_hour", label: i18n.date_range_next_hour },
	{ id: "next_day", label: i18n.date_range_next_day },
	{ id: "next_7_days", label: i18n.date_range_next_7_days },
	{ id: "next_90_days", label: i18n.date_range_next_90_days },
];

function MenuTaskFilterDueDate() {
	const activeFilter = useSelector(selectTaskFilterDueDate);
	const dispatch = useDispatch();

	return (
		<Menu.DropdownMenu
			aria-label={i18n.filter_by_due_date}
			selectedKeys={activeFilter ? [activeFilter] : undefined}
			selectionMode="single"
		>
			<Menu.Section>
				<Menu.SectionHeader icon={<Icon icon={faClockRotateLeft} />}>
					{i18n.overdue}
				</Menu.SectionHeader>
				{DUE_DATE_PAST_ITEMS.map(({ id, label }) => {
					return (
						<Menu.Item
							id={id}
							key={id}
							onAction={() => {
								return dispatch(dueDateFilterApplied(id));
							}}
						>
							{label}
						</Menu.Item>
					);
				})}
			</Menu.Section>
			<Menu.Section>
				<Menu.SectionHeader
					icon={<Icon icon={faClockRotateLeft} style={{ transform: "scaleX(-1)" }} />}
				>
					{i18n.upcoming}
				</Menu.SectionHeader>
				{DUE_DATE_FUTURE_ITEMS.map(({ id, label }) => {
					return (
						<Menu.Item
							id={id}
							key={id}
							onAction={() => {
								return dispatch(dueDateFilterApplied(id));
							}}
						>
							{label}
						</Menu.Item>
					);
				})}
			</Menu.Section>
			<Menu.Section>
				<Menu.Item
					color="red"
					hideCheckbox
					icon={<Icon color="red" icon={faTimes} />}
					id="clear_filters"
					isDisabled={!activeFilter}
					onAction={() => {
						dispatch(dueDateFilterCleared());
					}}
				>
					{i18n.clear_filters}
				</Menu.Item>
			</Menu.Section>
		</Menu.DropdownMenu>
	);
}

/**
 * A dropdown menu with sub-menus, that allows setting all available filters.
 * If any filters are currently applied, it will render a more subtle, smaller button.
 */

function MenuTaskFilters() {
	const is_filtered = useSelector(selectAreTasksFiltered);

	return (
		<Menu.Trigger>
			<TooltipTrigger delay={1000}>
				<Button appearance={is_filtered ? "ghost" : "secondary"} square={is_filtered}>
					<Icon color="grey" icon={faFilterList} />
					{is_filtered ? null : i18n.filters}
				</Button>
				<Tooltip placement="bottom">{i18n.filter_tasks}</Tooltip>
			</TooltipTrigger>
			<Popover>
				<Menu.DropdownMenu>
					<Menu.Section>
						<Menu.SubMenuTrigger>
							<Menu.Item>{i18n.status}</Menu.Item>
							<Popover placement="right top">
								<MenuTaskFilterStatus />
							</Popover>
						</Menu.SubMenuTrigger>

						<Menu.SubMenuTrigger>
							<Menu.Item>{i18n.due_date}</Menu.Item>
							<Popover placement="right top">
								<MenuTaskFilterDueDate />
							</Popover>
						</Menu.SubMenuTrigger>
					</Menu.Section>
				</Menu.DropdownMenu>
			</Popover>
		</Menu.Trigger>
	);
}

/**
 * A toolbar that composes all of the filtering options for tasks.
 */
export function ToolbarTaskFilters() {
	return (
		<App.Main.Toolbar>
			<FilterControlTaskStatus />
			<FilterControlDueDate />
			<MenuTaskFilters />
		</App.Main.Toolbar>
	);
}
