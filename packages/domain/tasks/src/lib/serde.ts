// Because a Set (the default type for a Table selection)
// is not serializable, we need to convert it to an array
// before storing it in the Redux store.

// eslint-disable-next-line no-restricted-imports -- usually discourage direct import from `react-aria-components`, but this is necessary
import type { Selection } from "react-aria-components";

export type SerializableSelection = "all" | string[];

export function serializeSelection(s: Selection): SerializableSelection {
	return s === "all"
		? "all"
		: Array.from(s).map((k) => {
				return k.toString();
			});
}

export function deserializeSelection(s: SerializableSelection): Selection {
	return s === "all" ? "all" : new Set(s);
}

if (import.meta.vitest) {
	const { expect, it } = import.meta.vitest;

	it("serializes a selection", () => {
		expect(serializeSelection("all")).toEqual("all");
		expect(serializeSelection(new Set(["a", "b"]))).toEqual(["a", "b"]);
	});
	it("deserializes a selection", () => {
		expect(deserializeSelection("all")).toEqual("all");
		expect(deserializeSelection(["a", "b"])).toEqual(new Set(["a", "b"]));
	});
}
