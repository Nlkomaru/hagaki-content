import { bindings, defineConfig } from "cf/config";

export default defineConfig({
	worker: {
		name: "hagaki-content",
		compatibilityDate: "2026-10-01",
		entrypoint: "src/index.ts",
		workersDev: true,
		assets: {
			runWorkerFirst: [
				"/article/*",
			],
		},
		env: {
			ASSETS: bindings.assets(),
		},
	},
});
