import type { Color } from "boondoggle";

import type { PaymentStatus } from "../types";

import { Pill } from "boondoggle";

import { capitalize, exhaustiveSwitchGuard, snakeToSpace } from "@shared/utils";

const getColor = (status: PaymentStatus): Color => {
	switch (status) {
		case "completed":
			return "green";
		case "failed":
			return "red";
		case "pending":
			return "amber";
		case "refunded":
			return "blue";
		default:
			return exhaustiveSwitchGuard(status);
	}
};

export function PillPaymentStatus({ status }: { status: PaymentStatus }) {
	return <Pill color={getColor(status)}>{capitalize(snakeToSpace(status))}</Pill>;
}
