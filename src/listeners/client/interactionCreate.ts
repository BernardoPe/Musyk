import { BaseInteraction, ButtonInteraction, ChatInputCommandInteraction, Events } from "discord.js"
import { dispatch } from "@/handlers/commands.ts"
import { GuildQueue, QueueRepeatMode, useQueue } from "discord-player"
import { errorEmbed, successEmbed } from "@/embeds/status.ts"
import { helpEmbeds } from "@/embeds/help.ts"
import { createLink } from "@/embeds/links.ts"
import { serverRepository } from "@/storage/repositories/server.ts"
import { logger } from "@/utils/logger/logger.ts"

import type { Language } from "@/langs"
import type { ClientEventHandler, MusicBot, QueueMetadata } from "@/types.ts"

type TextCommand = (
	interaction: ChatInputCommandInteraction,
	serverPrefix: string,
	bot: MusicBot,
	lang: Language
) => Promise<void> | void

class InteractionCreateHandler implements ClientEventHandler {
	public name: Events.InteractionCreate = Events.InteractionCreate

	public async execute(interaction: BaseInteraction, bot: MusicBot) {
		const server = await serverRepository.getOrPut(interaction.guild!)
		const serverQueue: GuildQueue<QueueMetadata> | null = useQueue(interaction.guild!.id)
		if (!interaction.isButton()) {
			this.handleTextCommands(interaction as ChatInputCommandInteraction, server.prefix, bot, server.lang)
		} else {
			if (!serverQueue) return
			this.handleButtonCommands(interaction, serverQueue, bot)
		}
	}

	private readonly textCommands: { [key: string]: TextCommand } = {
		help: this.helpCommand,
		prefix: this.prefixCommand,
		language: this.langCommand,
	}

	private handleTextCommands(
		interaction: ChatInputCommandInteraction,
		serverPrefix: string,
		bot: MusicBot,
		lang: Language
	) {
		const { commandName } = interaction
		if (this.textCommands[commandName]) {
			this.textCommands[commandName](interaction, serverPrefix, bot, lang)
		}
	}

	private handleButtonCommands(
		interaction: ButtonInteraction,
		serverQueue: GuildQueue<QueueMetadata>,
		bot: MusicBot
	) {
		const { customId } = interaction

		interaction.deferUpdate().then(() => {
			switch (customId) {
				case "increaseVolume": {
					const volume = serverQueue.node.volume === 200 ? 200 : serverQueue.node.volume + 20
					serverQueue.node.setVolume(volume)
					return
				}
				case "decreaseVolume": {
					const volume = serverQueue.node.volume === 0 ? 0 : serverQueue.node.volume - 20
					serverQueue.node.setVolume(volume)
					return
				}
				case "pause":
				case "resume": {
					const command = serverQueue.isPlaying() && !serverQueue.dispatcher!.isPaused() ? "pause" : "resume"
					dispatch(bot, command, [command], interaction, customId)
					return
				}
				case "cycle": {
					const mode = serverQueue.repeatMode === QueueRepeatMode.TRACK ? "off" : "track"
					dispatch(bot, "cycle", ["cycle", mode], interaction, customId)
					return
				}
				case "autoplay": {
					const mode = serverQueue.repeatMode === QueueRepeatMode.AUTOPLAY ? "off" : "autoplay"
					dispatch(bot, "cycle", ["cycle", mode], interaction, customId)
					return
				}
				default:
					dispatch(bot, customId, [customId], interaction, customId)
			}
		})
	}

	private async helpCommand(
		interaction: ChatInputCommandInteraction,
		_serverPrefix: string,
		_bot: MusicBot,
		lang: Language
	) {
		const embed = helpEmbeds(lang)
		const link = createLink(lang)
		await interaction.reply({
			embeds: embed,
			components: [link],
			flags: "Ephemeral",
		})
	}

	private async prefixCommand(
		interaction: ChatInputCommandInteraction,
		serverPrefix: string,
		_bot: MusicBot,
		lang: Language
	) {
		const newPrefix = interaction.options.get("prefix")!.value as string

		if (newPrefix === "current" || newPrefix === "curr") {
			const embed = successEmbed(null, lang.shared.current_prefix.replace("{prefix}", serverPrefix))
			await interaction.reply({ embeds: [embed], flags: "Ephemeral" })
			return
		}

		try {
			await serverRepository.updatePrefix(interaction.guild!, newPrefix)
		} catch (e) {
			const embed = errorEmbed(null, lang.shared.set_prefix_error)
			await interaction.reply({ embeds: [embed], flags: "Ephemeral" })
			logger.error(e)
			return
		}

		const embed = successEmbed(null, lang.shared.set_prefix.replace("{prefix}", newPrefix))
		await interaction.reply({ embeds: [embed] })
	}

	private async langCommand(
		interaction: ChatInputCommandInteraction,
		_serverPrefix: string,
		_bot: MusicBot,
		lang: Language
	) {
		const newLang = interaction.options.getString("language")!

		if (newLang === "current" || newLang === "curr") {
			const embed = successEmbed(null, lang.shared.current_lang.replace("{lang}", lang.tag))
			await interaction.reply({ embeds: [embed], flags: "Ephemeral" })
			return
		}

		try {
			await serverRepository.updateLanguage(interaction.guild!, newLang)
		} catch (e) {
			const embed = errorEmbed(null, lang.shared.set_lang_error)
			await interaction.reply({ embeds: [embed], flags: "Ephemeral" })
			logger.error(e)
			return
		}

		const embed = successEmbed(null, lang.shared.set_lang.replace("{lang}", newLang))
		await interaction.reply({ embeds: [embed] })
	}
}

export default new InteractionCreateHandler()
