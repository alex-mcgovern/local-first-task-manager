import type { Currency } from "@shared/currency";

import { formatCurrency } from "@shared/currency";

export function PaymentAmount({
	amount_in_minor,
	currency,
}: {
	amount_in_minor: number;
	currency: Currency;
}) {
	return (
		<div className="transaction-amount">
			{"+"}
			{formatCurrency(amount_in_minor, {
				currency: currency,
				from_minor: true,
			})}
		</div>
	);
}
