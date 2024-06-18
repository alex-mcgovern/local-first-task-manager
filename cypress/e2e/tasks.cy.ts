import { faker } from "@faker-js/faker";

import { formatDateTime } from "@shared/date";
import * as i18n from "@shared/i18n";

const getDueDate = (hourOffset = 0) => {
	const date = new Date();
	// Set the due date to be at the very start of 2 hours from now

	date.setDate(date.getDate() + 1);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	date.setHours(hourOffset);

	return {
		day: date.getDate(),
		formatted: formatDateTime(date.toISOString()),
		hours: date.getHours(),
		minutes: date.getMinutes(),
		month: date.getMonth(),
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
	cy.get("div[role=spinbutton][data-type=day]").eq(0).should("have.value", day.toString());
	cy.get("div[role=spinbutton][data-type=month]").eq(0).should("have.value", month.toString());
	cy.get("div[role=spinbutton][data-type=year]").eq(0).should("have.value", year.toString());
	cy.get("div[role=spinbutton][data-type=hour]").eq(0).should("have.value", hours.toString());
	cy.get("div[role=spinbutton][data-type=minute]").eq(0).should("have.value", minutes.toString());
};

describe("Tasks", () => {
	it("Create task dialog works correctly and is accessible", () => {
		cy.visit("/");

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
		cy.visit("/");

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

	it.only("Creates & updates tasks with all fields", () => {
		cy.visit("/");

		// With required fields only

		const title_1 = faker.git.commitMessage();
		const title_2 = faker.git.commitMessage();

		const description_1 = faker.lorem.paragraph();
		const description_2 = faker.lorem.paragraph();

		const due_date_1 = getDueDate();
		const due_date_2 = getDueDate(1);

		cy.findByText(i18n.new_task).click();

		cy.findByRole("dialog")
			.should("be.visible")
			.within(() => {
				// Expect input to be focused
				cy.findByLabelText(i18n.title).should("have.focus").type(title_1);

				cy.findByLabelText(i18n.description).type(description_1);

				cy.findByTestId("due_date").within(() => {
					populateDueDate(due_date_1);
				});

				cy.findByText(i18n.submit).click();
			});

		cy.findAllByRole("row").contains(title_1).should("exist").click();
		cy.url().should("match", /\/tasks\/[0-9a-f-]+/);

		cy.get("#app-drawer-container")
			.should("be.visible")
			.within(() => {
				cy.findByLabelText(i18n.title).should("have.value", title_1).clear().type(title_2);

				cy.findByLabelText(i18n.description).should("have.value", description_1).clear();
				cy.findByLabelText(i18n.description).type(description_2);

				cy.findByTestId("due_date").within(() => {
					assertDueDateInput(due_date_1);

					populateDueDate(due_date_2);
					assertDueDateInput(due_date_2);
				});

				cy.findByText(i18n.update).click();
				cy.findByLabelText("Close").click();
			});

		cy.findAllByRole("row").contains(title_2).should("exist").click();
	});

	it("Deleting a task that is open works closes dialog and navigates to home", () => {
		cy.visit("/");

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

		// Move focus out of the drawer
		cy.get("body").click(0, 0);

		cy.findAllByRole("row")
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
});
