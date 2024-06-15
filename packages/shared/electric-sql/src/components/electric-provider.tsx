import type { Electric } from "../client";

import { useEffect, useState } from "react";

import { makeElectricContext } from "electric-sql/react";
import { uniqueTabId } from "electric-sql/util";
import { LIB_VERSION } from "electric-sql/version";
import { ElectricDatabase, electrify } from "electric-sql/wa-sqlite";

import { authToken } from "../../../../../src/auth";
import { schema } from "../client";

const { ElectricProvider, useElectric } = makeElectricContext<Electric>();

function ElectricProviderComponent({ children }: { children: React.ReactNode }) {
	const [electric, setElectric] = useState<Electric>();

	useEffect(() => {
		let isMounted = true;

		const init = async () => {
			const config = {
				debug: import.meta.env.DEV,
				url: import.meta.env.ELECTRIC_SERVICE,
			};

			const { tabId } = uniqueTabId();
			const scopedDbName = `basic-${LIB_VERSION}-${tabId}.db`;

			const conn = await ElectricDatabase.init(scopedDbName);
			const client = await electrify(conn, schema, config);
			await client.connect(authToken());

			if (!isMounted) {
				return;
			}

			setElectric(client);
		};

		void init();

		return () => {
			isMounted = false;
		};
	}, []);

	if (electric === undefined) {
		return null;
	}

	return <ElectricProvider db={electric}>{children}</ElectricProvider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- This is the recommended approach from electric-sql, also it doesn't change often, so fast refresh in dev isn't an issue
export { ElectricProviderComponent as ElectricProvider, useElectric };
