import path from "path"
import { getAllFiles } from "../../utils/files/dir.ts"
import { DEFAULT_LANGUAGE } from "../constants/server.ts"
import { logger } from "../../utils/logger/logger.ts"

import type { Language } from "../../langs"
import { fileURLToPath } from "url"
import fs from "node:fs"

class LanguageService {
	private readonly languages: Map<string, Language> = new Map()
	private initialized = false

	private async ensureLanguages(): Promise<void> {
		if (this.initialized) return

		try {
			const currentFileDir = path.dirname(fileURLToPath(import.meta.url))
			const langFiles = getAllFiles(path.join(currentFileDir, "../../langs/data")).filter((file) =>
				file.endsWith(".json")
			)
			for (const file of langFiles) {
				const lang = JSON.parse(fs.readFileSync(file, "utf-8")) as Language
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
		await this.ensureLanguages()

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
