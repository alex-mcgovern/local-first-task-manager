import type { CalendarDate } from "@internationalized/date";

import { ZonedDateTime, now } from "@internationalized/date";
import { z } from "zod";

import { exhaustiveSwitchGuard } from "@shared/utils";

export const formatDate = (date?: string) => {
	return date ? new Date(date).toLocaleDateString("en-AE") : undefined;
};

export const formatDateTime = (date?: string) => {
	return date
		? new Date(date).toLocaleDateString("en-AE", {
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

export type PreselectedDatetimeRange =
	| "last_7_days"
	| "last_30_days"
	| "last_90_days"
	| "last_day"
	| "last_hour";

type RangeInput = ISOStringDatetimeRange | PreselectedDatetimeRange | ZonedDateTimeRange;

const PRESELECTED_RANGES: PreselectedDatetimeRange[] = [
	"last_7_days",
	"last_30_days",
	"last_90_days",
	"last_day",
	"last_hour",
];

export class DateTimeRange {
	range: ISOStringDatetimeRange | PreselectedDatetimeRange;

	constructor(input: RangeInput) {
		if (this.isInputPreselectedRange(input)) {
			this.range = input;
		} else if (typeof input === "string") {
			this.range = this.parseCommaSeparatedDatetimeRange(input);
		} else if (this.isInputZonedDateTimeRange(input)) {
			this.range = this.parseZonedDateTimeRange(input);
		} else {
			this.range = input;
		}
	}

	private isInputPreselectedRange(input: RangeInput): input is PreselectedDatetimeRange {
		return typeof input === "string" && PRESELECTED_RANGES.includes(input);
	}

	private isInputZonedDateTimeRange(input: RangeInput): input is ZonedDateTimeRange {
		return (
			typeof input === "object" &&
			input.from instanceof ZonedDateTime &&
			input.to instanceof ZonedDateTime
		);
	}

	private parseCommaSeparatedDatetimeRange(input: string): ISOStringDatetimeRange {
		const [from, to] = input.split(",");
		if (!from || !to) {
			throw new Error("Invalid serialized date range");
		}
		return {
			from: from,
			to: to,
		};
	}

	private parsePreselectedDatetimeRange(
		dateRange: PreselectedDatetimeRange,
	): ISOStringDatetimeRange {
		switch (dateRange) {
			case "last_hour": {
				return {
					from: now("UTC")
						.subtract({ hours: 1 })
						.set({ millisecond: 0 })
						.toAbsoluteString(),
					to: now("UTC").add({ seconds: 1 }).set({ millisecond: 0 }).toAbsoluteString(),
				};
			}

			case "last_day": {
				return {
					from: now("UTC")
						.subtract({ days: 1 })
						.set({ millisecond: 0 })
						.toAbsoluteString(),
					to: now("UTC").add({ seconds: 1 }).set({ millisecond: 0 }).toAbsoluteString(),
				};
			}
			case "last_7_days": {
				return {
					from: now("UTC")
						.subtract({ days: 7 })
						.set({ hour: 0, millisecond: 0, minute: 0, second: 0 })
						.toAbsoluteString(),
					to: now("UTC").add({ seconds: 1 }).set({ millisecond: 0 }).toAbsoluteString(),
				};
			}
			case "last_30_days": {
				return {
					from: now("UTC")
						.subtract({ days: 30 })
						.set({ hour: 0, millisecond: 0, minute: 0, second: 0 })
						.toAbsoluteString(),
					to: now("UTC").add({ seconds: 1 }).set({ millisecond: 0 }).toAbsoluteString(),
				};
			}
			case "last_90_days": {
				return {
					from: now("UTC")
						.subtract({ days: 90 })
						.set({ hour: 0, millisecond: 0, minute: 0, second: 0 })
						.toAbsoluteString(),
					to: now("UTC").add({ seconds: 1 }).set({ millisecond: 0 }).toAbsoluteString(),
				};
			}
			default: {
				return exhaustiveSwitchGuard(dateRange);
			}
		}
	}

	private parseZonedDateTimeRange(input: {
		from: ZonedDateTime;
		to: ZonedDateTime;
	}): ISOStringDatetimeRange {
		return {
			from: input.from.toAbsoluteString(),
			to: input.to.toAbsoluteString(),
		};
	}

	isPreselectedRange(): this is PreselectedDatetimeRange {
		return (
			typeof this === "string" &&
			PRESELECTED_RANGES.includes(this as PreselectedDatetimeRange)
		);
	}

	serialize(): string {
		return this.isInputPreselectedRange(this.range)
			? this.range
			: `${this.range.from},${this.range.to}`;
	}

	toISOString(): ISOStringDatetimeRange {
		if (this.isInputPreselectedRange(this.range)) {
			return this.parsePreselectedDatetimeRange(this.range);
		}

		return {
			from: this.range.from,
			to: this.range.to,
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
