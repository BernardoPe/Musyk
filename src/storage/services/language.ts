import en from "@/langs/data/en.json"
import ptPt from "@/langs/data/pt-pt.json"
import { DEFAULT_LANGUAGE } from "@/storage/constants/server.ts"
import { logger } from "@/utils/logger/logger.ts"

import type { Language } from "@/langs"

function validateLanguage(lang: Language, source: string): Language {
	const required = ["tag", "name", "shared", "commands", "embeds"] as const
	const missing = required.filter((key) => lang[key] == null)
	if (missing.length > 0) {
		throw new Error(`Invalid language file '${source}': missing keys ${missing.join(", ")}`)
	}
	return lang
}

const allLanguages: Language[] = [validateLanguage(en, "en.json"), validateLanguage(ptPt, "pt-pt.json")]

class LanguageService {
	private readonly languages: Map<string, Language> = new Map()

	constructor() {
		for (const lang of allLanguages) {
			this.languages.set(lang.tag, lang)
			logger.info(`[LANG] Loaded language: ${lang.tag}`)
		}
	}

	public async getLanguage(tag: string): Promise<Language> {
		const language = this.languages.get(tag)
		if (!language) {
			logger.warn(`Language '${tag}' not found, falling back to '${DEFAULT_LANGUAGE}'`)
			return this.languages.get(DEFAULT_LANGUAGE) ?? en
		}

		return language
	}

	public has(tag: string): boolean {
		return this.languages.has(tag)
	}

	public getLanguageChoices(): { name: string; value: string }[] {
		return Array.from(this.languages.values()).map((lang) => ({ name: lang.name, value: lang.tag }))
	}
}

export const languageService = new LanguageService()
