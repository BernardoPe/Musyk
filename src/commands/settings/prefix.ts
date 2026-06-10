import { errorEmbed, successEmbed } from "@/embeds/status.ts"
import { serverRepository } from "@/storage/repositories/server.ts"
import { logger } from "@/utils/logger/logger.ts"

import type { ChatInputCommandInteraction } from "discord.js"
import type { SlashCommand, SlashCommandContext } from "@/types.ts"

class PrefixCommand implements SlashCommand {
	public slashName: string = "prefix"

	public async executeSlash(interaction: ChatInputCommandInteraction, ctx: SlashCommandContext) {
		const { config, guild } = ctx
		const newPrefix = interaction.options.getString("prefix", true)

		if (newPrefix === "current" || newPrefix === "curr") {
			const embed = successEmbed(null, config.lang.shared.current_prefix.replace("{prefix}", config.prefix))
			await interaction.reply({ embeds: [embed], flags: "Ephemeral" })
			return
		}

		try {
			await serverRepository.updatePrefix(guild, newPrefix)
		} catch (error) {
			const embed = errorEmbed(null, config.lang.shared.set_prefix_error)
			await interaction.reply({ embeds: [embed], flags: "Ephemeral" })
			logger.error(error)
			return
		}

		const embed = successEmbed(null, config.lang.shared.set_prefix.replace("{prefix}", newPrefix))
		await interaction.reply({ embeds: [embed] })
	}
}

export default new PrefixCommand()
