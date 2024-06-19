import type { task_statusType as TaskStatus } from "@shared/electric-sql";

import { faker } from "@faker-js/faker";

import { formatDateTime } from "@shared/date";
import * as i18n from "@shared/i18n";
import { exhaustiveSwitchGuard } from "@shared/utils";

// Note: This is duplicated from the `@domain/tasks` package — as it's
// only really being used for testing, don't want to pollute the global
// namespace with it.
export function getStatusString(status: TaskStatus) {
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

const getDueDate = ({
	dayOffset = 0,
	hourOffset = 0,
}: {
	dayOffset?: number;
	hourOffset?: number;
}) => {
	const date = new Date();
	// Set the due date to be at the very start of 2 hours from now

	date.setDate(date.getDate() + dayOffset);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	date.setHours(hourOffset);

	return {
		day: date.getDate(),
		formatted: formatDateTime(date.toISOString()),
		hours: date.getHours(),
		minutes: date.getMinutes(),
		month: date.getMonth() + 1,
		year: date.getFullYear(),
	};
};

const populateDueDate = ({ day, hours, minutes, month, year }: ReturnType<typeof getDueDate>) => {
	cy.get("div[role=spinbutton][data-type=day]").eq(0).type(day.toString());
	cy.get("div[role=spinbutton][data-type=month]").eq(0).type(month.toString());
	cy.get("div[role=spinbutton][data-type=year]").eq(0).type(year.toString());
	cy.get("div[role=spinbutton][data-type=hour]").eq(0).type(hours.toString());
	cy.get("div[role=spinbutton][data-type=minute]").eq(0).type(minutes.toString());
};

const assertDueDateInput = ({
	day,
	hours,
	minutes,
	month,
	year,
}: ReturnType<typeof getDueDate>) => {
	cy.get("div[role=spinbutton][data-type=day]").eq(0).should("contain", day.toString());
	cy.get("div[role=spinbutton][data-type=month]").eq(0).should("contain", month.toString());
	cy.get("div[role=spinbutton][data-type=year]").eq(0).should("contain", year.toString());
	cy.get("div[role=spinbutton][data-type=hour]").eq(0).should("contain", hours.toString());
	cy.get("div[role=spinbutton][data-type=minute]").eq(0).should("contain", minutes.toString());
};

const createTask = ({
	due_date,
	status,
}: {
	due_date?: "future" | "past";
	status?: TaskStatus;
}) => {
	const title = faker.git.commitMessage();

	cy.findByText(i18n.new_task).click();

	cy.findByRole("dialog")
		.should("be.visible")
		.within(() => {
			cy.findByLabelText(i18n.title).should("have.focus").type(title);

			if (due_date) {
				const date =
					due_date === "future"
						? getDueDate({ hourOffset: 1 })
						: getDueDate({ hourOffset: -2 });

				cy.findByTestId("due_date").within(() => {
					populateDueDate(date);
				});
			}

			if (status) {
				cy.findByLabelText(i18n.status, { selector: "input" })
					.clear()
					.type(`${getStatusString(status)}{downarrow}{enter}`);
			}

			cy.findByText(i18n.submit).click();
		});

	cy.findAllByRole("row").contains(title).should("exist");
};

const dismissOverlay = () => {
	cy.get("body").click(0, 0, { force: true });
};

describe("Tasks", () => {
	beforeEach(() => {
		// Note: The directory wildcard is because the request URL may be to
		// `node_modules` during development or `assets` in production
		cy.intercept("GET", "/**/*/wa-sqlite-async*.wasm").as("getTasks");

		cy.visit("/");

		cy.wait("@getTasks");
	});

	it("Create task dialog works correctly and is accessible", () => {
		// With mouse navigation

		cy.findByText(i18n.new_task).click();

		cy.findByRole("dialog")
			.should("be.visible")
			.within(() => {
				// Expect input to be focused
				cy.findByLabelText(i18n.title).should("have.focus");

				cy.findByLabelText("Close").click();
			});
		cy.findByRole("dialog").should("not.exist");

		// And with keyboard navigation

		cy.get("body").type("c");

		cy.findByRole("dialog")
			.should("be.visible")
			.within(() => {
				// Expect input to be focused
				cy.findByLabelText(i18n.title).should("have.focus");
			});

		cy.get("body").type("{esc}");
		cy.findByRole("dialog").should("not.exist");
	});

	it("Creates & updates tasks with required fields only", () => {
		// With required fields only

		const title_1 = faker.git.commitMessage();
		const title_2 = faker.git.commitMessage();

		cy.findByText(i18n.new_task).click();

		cy.findByRole("dialog")
			.should("be.visible")
			.within(() => {
				// Expect input to be focused
				cy.findByLabelText(i18n.title).should("have.focus").type(title_1);
				cy.findByText(i18n.submit).click();
			});

		cy.findAllByRole("row").contains(title_1).should("exist").click();
		cy.url().should("match", /\/tasks\/[0-9a-f-]+/);

		cy.get("#app-drawer-container")
			.should("be.visible")
			.within(() => {
				cy.findByLabelText(i18n.title).should("have.value", title_1).clear().type(title_2);

				cy.findByText(i18n.update).click();
				cy.findByLabelText("Close").click();
			});

		cy.findAllByRole("row").contains(title_2).should("exist").click();
	});

	it("Creates & updates tasks with all fields", () => {
		// With required fields only

		const title_1 = faker.git.commitMessage();
		const title_2 = faker.git.commitMessage();

		const description_1 = faker.lorem.paragraph();
		const description_2 = faker.lorem.paragraph();

		const due_date_1 = getDueDate({ dayOffset: 1, hourOffset: 1 });
		const due_date_2 = getDueDate({ dayOffset: 1, hourOffset: 2 });

		cy.findByText(i18n.new_task).click();

		cy.findByRole("dialog")
			.should("be.visible")
			.within(() => {
				// Set title (Expect input to be focused)

				cy.findByLabelText(i18n.title).should("have.focus").type(title_1);

				// Set description

				cy.findByLabelText(i18n.description).type(description_1);

				// Set due date

				cy.findByTestId("due_date").within(() => {
					populateDueDate(due_date_1);
				});

				// Set priority

				cy.findByLabelText(i18n.priority, { selector: "input" })
					.clear()
					.type(`${i18n.priority_urgent}{downarrow}{enter}`);

				// Set status

				cy.findByLabelText(i18n.status, { selector: "input" })
					.click()
					.type(`${i18n.status_to_do}{downarrow}{enter}`);

				// Submit the form

				cy.findByText(i18n.submit).click();
			});

		cy.findAllByRole("row").contains(title_1).should("exist").click();
		cy.url().should("match", /\/tasks\/[0-9a-f-]+/);

		cy.get("#app-drawer-container")
			.should("be.visible")
			.within(() => {
				// Check & update title

				cy.findByLabelText(i18n.title).should("have.value", title_1).clear().type(title_2);

				// Check & update description

				cy.findByLabelText(i18n.description).should("have.value", description_1).clear();
				cy.findByLabelText(i18n.description).type(description_2);

				// Check & update due date

				cy.findByTestId("due_date").within(() => {
					assertDueDateInput(due_date_1);

					populateDueDate(due_date_2);
					assertDueDateInput(due_date_2);
				});

				// Check & update priority

				cy.findByLabelText(i18n.priority, { selector: "input" })
					.should("have.value", i18n.priority_urgent)
					.clear()
					.type(`${i18n.priority_low}{downarrow}{enter}`);

				// Check & update status

				cy.findByLabelText(i18n.status, { selector: "input" })
					.should("have.value", i18n.status_to_do)
					.clear()
					.type(`${i18n.status_in_progress}{downarrow}{enter}`);

				// Submit the form & close the drawer

				cy.findByText(i18n.update).click();
				cy.findByLabelText("Close").click();
			});

		cy.findAllByRole("row")
			.contains(title_2)
			.should("exist")
			.parent()
			.within(() => {
				cy.findByTestId("menu_priority_p3").should("exist");
				cy.findByTestId("menu_status_in_progress").should("exist");
				if (due_date_2.formatted) {
					cy.findByText(due_date_2.formatted).should("exist");
				} else {
					throw new Error("There's an error with the due date");
				}
			});
	});

	it("Filters tasks by status", () => {
		(["to_do", "in_progress", "completed"] satisfies TaskStatus[]).forEach((status) => {
			// Ensure there's a few tasks of this priority

			for (let i = 0; i < 3; i++) {
				createTask({ status });
			}

			cy.findByText(i18n.filters).click();

			cy.findByRole("menu")
				.should("be.visible")
				.within(() => {
					cy.findByText(i18n.status).click();
				});

			cy.findByLabelText(i18n.filter_by_status).within(() => {
				cy.findByText(getStatusString(status)).click();
			});
			dismissOverlay();

			cy.findByRole("group")
				.contains(i18n.status)
				.should("exist")
				.parent()
				.contains("button", getStatusString(status));

			// Every table row should have an element with test ID `menu_status_to_do`

			cy.get("tbody")
				.should("not.be.empty")
				.within(() => {
					cy.findAllByRole("row").each((row) => {
						cy.wrap(row).within(() => {
							cy.findByTestId(`menu_status_${status}`).should("exist");
						});
					});
				});

			// Clear the filter

			cy.findByLabelText("Remove filter").click();

			cy.findByRole("group").should("not.exist");
		});
	});

	it("Filters tasks by due date", () => {
		// Ensure there's some tasks in the past / future

		for (let i = 0; i < 3; i++) {
			createTask({ due_date: "future" });
			createTask({ due_date: "past" });
		}

		cy.findByText(i18n.filters).click();

		cy.findByRole("menu")
			.should("be.visible")
			.within(() => {
				cy.findByText(i18n.due_date).click();
			});

		cy.findByLabelText(i18n.filter_by_due_date).within(() => {
			cy.findByText(i18n.date_range_last_day).click();
		});
		dismissOverlay();

		cy.findByRole("group")
			.contains(i18n.due_date)
			.should("exist")
			.parent()
			.contains("button", i18n.date_range_last_day);

		cy.get("tbody")
			.should("not.be.empty")
			.within(() => {
				cy.findAllByRole("row").each((row) => {
					cy.wrap(row).within(() => {
						// Find the text content of the element with test-id "due-date"
						// Assert that it is in the past

						cy.findByTestId(`due-date`)
							.should("exist")
							.should("have.attr", "data-overdue", "true");
					});
				});
			});

		// Clear the filter

		cy.findByLabelText("Remove filter").click();

		cy.findByRole("group").should("not.exist");

		// Check again with tasks in the future

		cy.findByText(i18n.filters).click();

		cy.findByRole("menu")
			.should("be.visible")
			.within(() => {
				cy.findByText(i18n.due_date).click();
			});

		cy.findByLabelText(i18n.filter_by_due_date).within(() => {
			cy.findByText(i18n.date_range_next_day).click();
		});
		dismissOverlay();

		cy.findByRole("group")
			.contains(i18n.due_date)
			.should("exist")
			.parent()
			.contains("button", i18n.date_range_next_day);

		cy.get("tbody")
			.should("not.be.empty")
			.within(() => {
				cy.findAllByRole("row").each((row) => {
					cy.wrap(row).within(() => {
						// Find the text content of the element with test-id "due-date"
						// Assert that it is not in the past

						cy.findByTestId(`due-date`)
							.should("exist")
							.should("have.attr", "data-overdue", "false");
					});
				});
			});

		// Clear the filter

		cy.findByLabelText("Remove filter").click();

		cy.findByRole("group").should("not.exist");
	});

	it("Deleting a task that is open works closes dialog and navigates to home", () => {
		const title = faker.git.commitMessage();

		cy.findByText(i18n.new_task).click();

		cy.findByRole("dialog")
			.should("be.visible")
			.within(() => {
				// Expect input to be focused
				cy.findByLabelText(i18n.title).should("have.focus").type(title);
				cy.findByText(i18n.submit).click();
			});

		cy.findAllByRole("row").contains(title).should("exist").click();
		cy.url().should("match", /\/tasks\/[0-9a-f-]+/);

		cy.get("#app-drawer-container").should("be.visible");

		cy.findAllByRole("row", { hidden: true }) // Because the drawer traps focus, the row is hidden to assistive technology
			.contains(title)
			.should("exist")
			.parent()
			.within(() => {
				cy.get("label[slot=selection]").click();
			});

		cy.findByText(`${i18n.delete_selected} (1)`).click();

		cy.findAllByRole("row").contains(title).should("not.exist");
		cy.get("#app-drawer-container").should("be.empty");
	});

	// Note: This test would probably be extremly flakey in a real-world scenario
	// as it depends on state created by the previous tests. In a real-world scenario,
	// I would probably look at options like:
	// - Using a test database that is reset/seeded before each test
	// - Intercepting the call to the sync service and returning a fixture
	it("Deleting all tasks works", () => {
		cy.get("tbody").should("not.be.empty");

		cy.get("thead").within(() => {
			// Note: Not best practice to use `force` but optimizing for speed here
			cy.findByRole("checkbox").click({ force: true });
		});

		cy.findByText(i18n.delete_all).click();

		cy.get("tbody").should("be.empty");
	});
});
