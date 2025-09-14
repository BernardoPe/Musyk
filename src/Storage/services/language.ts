import path from "path"
import { Language } from "../../langs"
import { getAllFiles } from "../../utils/files/json.ts"
import { DEFAULT_LANGUAGE } from "../constants/server.ts"
import { logger } from "../../utils/logger/logger.ts"

class LanguageService {
	private readonly languages: Map<string, Language> = new Map()
	private initialized = false

	constructor() {
		this.initializeLanguages()
	}

	private async initializeLanguages(): Promise<void> {
		if (this.initialized) return

		try {
			const langFiles = getAllFiles(path.join(__dirname, "../../langs/data")).filter((file) =>
				file.endsWith(".json")
			)
			for (const file of langFiles) {
				const lang = require(file) as Language
				if (lang.tag) {
					this.languages.set(lang.tag, lang)
					logger.info(`[LANG] Loaded language: ${lang.tag}`)
				}
			}
			this.initialized = true
		} catch (error) {
			console.error("Failed to initialize languages:", error)
		}
	}

	public async getLanguage(tag: string): Promise<Language> {
		await this.initializeLanguages()

		const language = this.languages.get(tag)
		if (!language) {
			console.warn(`Language '${tag}' not found, falling back to '${DEFAULT_LANGUAGE}'`)
			return this.languages.get(DEFAULT_LANGUAGE) || this.getDefaultLanguage()
		}

		return language
	}

	private getDefaultLanguage(): Language {
		return {
			tag: DEFAULT_LANGUAGE,
			shared: { not_playing: "No music is currently playing" },
			commands: {},
			embeds: {},
		} as Language
	}
}

export const languageService = new LanguageService()
