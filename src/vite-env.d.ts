/* eslint-disable @typescript-eslint/consistent-type-definitions -- usually prefer types, but for this sort of module augmentation, interfaces are required */
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly ELECTRIC_SERVICE: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
