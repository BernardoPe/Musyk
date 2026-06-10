import { errorEmbed, successEmbed } from "@/embeds/status.ts"
import { serverRepository } from "@/storage/repositories/server.ts"
import { languageService } from "@/storage/services/language.ts"
import { logger } from "@/utils/logger/logger.ts"

import type { ChatInputCommandInteraction } from "discord.js"
import type { SlashCommand, SlashCommandContext } from "@/types.ts"

class LanguageCommand implements SlashCommand {
	public slashName: string = "language"

	public async executeSlash(interaction: ChatInputCommandInteraction, ctx: SlashCommandContext) {
		const { config, guild } = ctx
		const newLang = interaction.options.getString("language", true)

		if (newLang === "current" || newLang === "curr") {
			const embed = successEmbed(null, config.lang.shared.current_lang.replace("{lang}", config.lang.tag))
			await interaction.reply({ embeds: [embed], flags: "Ephemeral" })
			return
		}

		if (!languageService.has(newLang)) {
			const embed = errorEmbed(null, config.lang.shared.set_lang_error)
			await interaction.reply({ embeds: [embed], flags: "Ephemeral" })
			return
		}

		try {
			await serverRepository.updateLanguage(guild, newLang)
		} catch (error) {
			const embed = errorEmbed(null, config.lang.shared.set_lang_error)
			await interaction.reply({ embeds: [embed], flags: "Ephemeral" })
			logger.error(error)
			return
		}

		const embed = successEmbed(null, config.lang.shared.set_lang.replace("{lang}", newLang))
		await interaction.reply({ embeds: [embed] })
	}
}

export default new LanguageCommand()
