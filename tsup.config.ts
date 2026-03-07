import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["src/bot.ts", "src/slash-command-deployment.ts"],
	format: ["esm"],
	target: "node22",
	platform: "node",
	outDir: "dist",
	splitting: false,
	sourcemap: false,
	clean: true,
	bundle: true,
	minify: false,
	treeshake: true,
	dts: false,
	external: ["dotenv"],
})
