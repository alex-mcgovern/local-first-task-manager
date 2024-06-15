import { Button, Icon, Menu, Popover, Tooltip, TooltipTrigger } from "boondoggle";
import { faFilterList } from "@fortawesome/pro-solid-svg-icons/faFilterList";
import * as i18n from "@shared/i18n";
import { useDispatch, useSelector } from "react-redux";
import {
	filterByStatus,
	selectStatusFilterList,
	clearFilterTaskStatus,
	selectDueDateFilter,
	filterByDueDate,
	clearFilterDueDate,
} from "@shared/redux";
import { PreselectedDatetimeRange } from "@shared/date";
import { task_statusType } from "@shared/electric-sql";

const STATUS_MENU_ITEMS: { id: task_statusType; label: string }[] = [
	{ id: "to_do", label: i18n.status_to_do },
	{ id: "in_progress", label: i18n.status_in_progress },
	{ id: "completed", label: i18n.status_completed },
];

export function MenuTaskFilterStatus() {
	const activeFilters = useSelector(selectStatusFilterList);
	const dispatch = useDispatch();

	return (
		<Menu.DropdownMenu
			selectionMode="multiple"
			aria-label={i18n.filter_by_status}
			selectedKeys={activeFilters}
		>
			<Menu.Section>
				{STATUS_MENU_ITEMS.map(({ id, label }) => (
					<Menu.Item key={id} onAction={() => dispatch(filterByStatus(id))} id={id}>
						{label}
					</Menu.Item>
				))}
			</Menu.Section>
			<Menu.Section>
				<Menu.Item
					color="red"
					onAction={() => {
						dispatch(clearFilterTaskStatus());
					}}
					hideCheckbox
					isDisabled={activeFilters.length === 0}
					id="clear_filters"
				>
					{i18n.clear_filters}
				</Menu.Item>
			</Menu.Section>
		</Menu.DropdownMenu>
	);
}

const DUE_DATE_PAST_ITEMS: { id: PreselectedDatetimeRange; label: string }[] = [
	{ id: "last_hour", label: i18n.date_range_last_hour },
	{ id: "last_day", label: i18n.date_range_last_day },
	{ id: "last_7_days", label: i18n.date_range_last_7_days },
	{ id: "last_90_days", label: i18n.date_range_last_90_days },
];

const DUE_DATE_FUTURE_ITEMS: { id: PreselectedDatetimeRange; label: string }[] = [
	{ id: "next_hour", label: i18n.date_range_next_hour },
	{ id: "next_day", label: i18n.date_range_next_day },
	{ id: "next_7_days", label: i18n.date_range_next_7_days },
	{ id: "next_90_days", label: i18n.date_range_next_90_days },
];

export function MenuTaskFilterDueDate() {
	const activeFilter = useSelector(selectDueDateFilter);
	const dispatch = useDispatch();

	return (
		<Menu.DropdownMenu
			selectionMode="single"
			aria-label={i18n.filter_by_due_date}
			selectedKeys={activeFilter ? [activeFilter] : undefined}
		>
			<Menu.Section>
				<Menu.SectionHeader>{i18n.overdue}</Menu.SectionHeader>
				{DUE_DATE_PAST_ITEMS.map(({ id, label }) => (
					<Menu.Item key={id} onAction={() => dispatch(filterByDueDate(id))} id={id}>
						{label}
					</Menu.Item>
				))}
			</Menu.Section>
			<Menu.Section>
				<Menu.SectionHeader>{i18n.upcoming}</Menu.SectionHeader>
				{DUE_DATE_FUTURE_ITEMS.map(({ id, label }) => (
					<Menu.Item key={id} onAction={() => dispatch(filterByDueDate(id))} id={id}>
						{label}
					</Menu.Item>
				))}
			</Menu.Section>
			<Menu.Section>
				<Menu.Item
					color="red"
					onAction={() => {
						dispatch(clearFilterDueDate());
					}}
					hideCheckbox
					isDisabled={!activeFilter}
					id="clear_filters"
				>
					{i18n.clear_filters}
				</Menu.Item>
			</Menu.Section>
		</Menu.DropdownMenu>
	);
}

export function MenuTaskFilters() {
	return (
		<Menu.Trigger>
			<TooltipTrigger delay={1000}>
				<Button appearance="ghost" square>
					<Icon color="grey" icon={faFilterList} />
				</Button>
				<Tooltip placement="bottom">{i18n.filter_tasks}</Tooltip>
			</TooltipTrigger>
			<Popover placement="right top">
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
