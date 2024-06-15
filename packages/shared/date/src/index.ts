import type { CalendarDate } from "@internationalized/date";
import { ZonedDateTime, fromDate, now, parseAbsolute } from "@internationalized/date";
import { z } from "zod";
import { exhaustiveSwitchGuard } from "@shared/utils";

export const formatDate = (date?: string) => {
	return date ? new Date(date).toLocaleDateString("en-GB") : undefined;
};

export const formatDateTime = (date?: string) => {
	return date
		? new Date(date).toLocaleDateString("en-GB", {
				day: "2-digit",
				hour: "2-digit",
				hourCycle: "h23",
				minute: "2-digit",
				month: "2-digit",
				year: "2-digit",
			})
		: undefined;
};

export type ISOStringDatetimeRange = {
	from: string;
	to: string;
};

type ZonedDateTimeRange = {
	from: ZonedDateTime;
	to: ZonedDateTime;
};

type DateRange = {
	from: Date;
	to: Date;
};

export type PreselectedDatetimeRange =
	| "last_7_days"
	| "last_30_days"
	| "last_90_days"
	| "last_day"
	| "last_hour"
	| "next_7_days"
	| "next_30_days"
	| "next_90_days"
	| "next_day"
	| "next_hour";

type RangeInput =
	| DateRange
	| ISOStringDatetimeRange
	| PreselectedDatetimeRange
	| ZonedDateTimeRange;

const PRESELECTED_RANGES: PreselectedDatetimeRange[] = [
	"last_7_days",
	"last_30_days",
	"last_90_days",
	"last_day",
	"last_hour",
	"next_7_days",
	"next_30_days",
	"next_90_days",
	"next_day",
	"next_hour",
];

export class DateTimeRange {
	range: ZonedDateTimeRange;

	constructor(input: RangeInput) {
		if (this.isInputPreselected(input)) {
			this.range = this.parsePreselected(input);
		} else if (this.isInputISO(input)) {
			this.range = this.parseISO(input);
		} else if (this.isInputDate(input)) {
			this.range = this.parseDate(input);
		} else if (this.isInputZoned(input)) {
			this.range = input;
		} else {
			throw new Error("Invalid input");
		}
	}

	private isInputDate(input: RangeInput): input is DateRange {
		return typeof input === "object" && input.from instanceof Date && input.to instanceof Date;
	}

	private isInputISO(input: RangeInput): input is ISOStringDatetimeRange {
		return (
			typeof input === "object" &&
			typeof input.from === "string" &&
			typeof input.to === "string"
		);
	}

	private isInputPreselected(input: RangeInput): input is PreselectedDatetimeRange {
		return typeof input === "string" && PRESELECTED_RANGES.includes(input);
	}

	private isInputZoned(input: RangeInput): input is ZonedDateTimeRange {
		return (
			typeof input === "object" &&
			input.from instanceof ZonedDateTime &&
			input.to instanceof ZonedDateTime
		);
	}

	private parseDate(input: DateRange): ZonedDateTimeRange {
		return {
			from: fromDate(input.from, "UTC"),
			to: fromDate(input.to, "UTC"),
		};
	}

	private parseISO(input: ISOStringDatetimeRange): ZonedDateTimeRange {
		return {
			from: parseAbsolute(input.from, "UTC"),
			to: parseAbsolute(input.to, "UTC"),
		};
	}

	private parsePreselected(dateRange: PreselectedDatetimeRange): ZonedDateTimeRange {
		switch (dateRange) {
			case "last_hour": {
				return {
					from: now("UTC").subtract({ hours: 1 }).set({ millisecond: 0 }),
					to: now("UTC").add({ seconds: 1 }).set({ millisecond: 0 }),
				};
			}

			case "next_hour": {
				return {
					from: now("UTC").add({ seconds: 1 }).set({ millisecond: 0 }),
					to: now("UTC").add({ hours: 1 }).set({ millisecond: 0 }),
				};
			}

			case "last_day": {
				return {
					from: now("UTC").subtract({ days: 1 }).set({ millisecond: 0 }),
					to: now("UTC").add({ seconds: 1 }).set({ millisecond: 0 }),
				};
			}

			case "next_day": {
				return {
					from: now("UTC").add({ seconds: 1 }).set({ millisecond: 0 }),
					to: now("UTC").add({ days: 1 }).set({ millisecond: 0 }),
				};
			}

			case "last_7_days": {
				return {
					from: now("UTC")
						.subtract({ days: 7 })
						.set({ hour: 0, millisecond: 0, minute: 0, second: 0 }),
					to: now("UTC").add({ seconds: 1 }).set({ millisecond: 0 }),
				};
			}

			case "next_7_days": {
				return {
					from: now("UTC").add({ seconds: 1 }).set({ millisecond: 0 }),
					to: now("UTC")
						.add({ days: 7 })
						.set({ hour: 0, millisecond: 0, minute: 0, second: 0 }),
				};
			}

			case "last_30_days": {
				return {
					from: now("UTC")
						.subtract({ days: 30 })
						.set({ hour: 0, millisecond: 0, minute: 0, second: 0 }),
					to: now("UTC").add({ seconds: 1 }).set({ millisecond: 0 }),
				};
			}

			case "next_30_days": {
				return {
					from: now("UTC").add({ seconds: 1 }).set({ millisecond: 0 }),
					to: now("UTC")
						.add({ days: 30 })
						.set({ hour: 0, millisecond: 0, minute: 0, second: 0 }),
				};
			}

			case "last_90_days": {
				return {
					from: now("UTC")
						.subtract({ days: 90 })
						.set({ hour: 0, millisecond: 0, minute: 0, second: 0 }),
					to: now("UTC").add({ seconds: 1 }).set({ millisecond: 0 }),
				};
			}
			case "next_90_days": {
				return {
					from: now("UTC").add({ seconds: 1 }).set({ millisecond: 0 }),
					to: now("UTC")
						.add({ days: 90 })
						.set({ hour: 0, millisecond: 0, minute: 0, second: 0 }),
				};
			}
			default: {
				return exhaustiveSwitchGuard(dateRange);
			}
		}
	}

	isPreselectedRange(): this is PreselectedDatetimeRange {
		return (
			typeof this === "string" &&
			PRESELECTED_RANGES.includes(this as PreselectedDatetimeRange)
		);
	}

	toISOString(): ISOStringDatetimeRange {
		if (this.isInputPreselected(this.range)) {
			const { from, to } = this.parsePreselected(this.range);
			return {
				from: from.toAbsoluteString(),
				to: to.toAbsoluteString(),
			};
		}

		return {
			from: this.range.from.toAbsoluteString(),
			to: this.range.to.toAbsoluteString(),
		};
	}
}

export const zodCalendarDate = z
	.union([z.custom<CalendarDate>(), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)])
	.transform((value) => {
		if (typeof value === "string") {
			return value;
		}

		return value.toString();
	});
