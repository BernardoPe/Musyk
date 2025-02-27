import * as fs from "fs"
import * as path from "path"
import { CommandsLangConfig } from "./commands.ts"
import { EmbedsLangConfig } from "./embeds.ts"

const langsDir: string = __dirname
const langs: { [key: string]: Language } = {}

const files: string[] = fs.readdirSync(langsDir)

files
	.filter((file) => file.endsWith(".json"))
	.forEach((file) => {
		const filePath: string = path.join(langsDir, file)
		const langName: string = path.basename(file, ".json")
		const fileContent: string = fs.readFileSync(filePath, "utf-8")
		langs[langName] = JSON.parse(fileContent)
	})

export interface Language {
    tag: string;
    shared: SharedLangConfig;
    commands: CommandsLangConfig;
    embeds: EmbedsLangConfig;
}

interface SharedLangConfig {
    not_playing: string;
    current_prefix: string;
    current_lang: string;
    set_lang: string;
    set_lang_error: string;
    set_prefix: string;
    set_prefix_error: string;
}

export default langs
