import type { ComponentProps } from "react";

import type { PaymentMethod } from "../types";

import { faCcMastercard } from "@fortawesome/free-brands-svg-icons/faCcMastercard";
import { faCcVisa } from "@fortawesome/free-brands-svg-icons/faCcVisa";
import { Icon } from "boondoggle";

import { exhaustiveSwitchGuard } from "@shared/utils";

const getIcon = (method: PaymentMethod) => {
	switch (method) {
		case "mastercard":
			return faCcMastercard;
		case "visa":
			return faCcVisa;
		default:
			return exhaustiveSwitchGuard(method);
	}
};

export function IconPaymentMethod({
	method,
}: {
	method: PaymentMethod;
} & Omit<ComponentProps<typeof Icon>, "icon">) {
	return <Icon color="grey" icon={getIcon(method)} size="xl" />;
}
