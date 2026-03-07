import en from "../../langs/data/en.json"
import ptPt from "../../langs/data/pt-pt.json"
import { DEFAULT_LANGUAGE } from "../constants/server.ts"
import { logger } from "../../utils/logger/logger.ts"

import type { Language } from "../../langs"

const allLanguages: Language[] = [en as unknown as Language, ptPt as unknown as Language]

class LanguageService {
	private readonly languages: Map<string, Language> = new Map()

	constructor() {
		for (const lang of allLanguages) {
			if (lang.tag) {
				this.languages.set(lang.tag, lang)
				logger.info(`[LANG] Loaded language: ${lang.tag}`)
			}
		}
	}

	public async getLanguage(tag: string): Promise<Language> {
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
