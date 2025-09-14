import { BaseInteraction, ButtonInteraction, ChatInputCommandInteraction, Events } from "discord.js"
import { ClientEventHandler, MusicBot, QueueMetadata } from "../../types.ts"
import { handleCommand } from "../../handlers/commands.ts"
import { GuildQueue, QueueRepeatMode, useQueue } from "discord-player"
import { errorEmbed, successEmbed } from "../../embeds/status.ts"
import { helpEmbeds } from "../../embeds/help.ts"
import { createLink } from "../../embeds/links.ts"
import { Language } from "../../langs"
import { serverRepository } from "../../storage/repositories/server.ts"

type ButtonCommand = (
    interaction: ButtonInteraction,
    serverQueue: GuildQueue<QueueMetadata>,
    serverPrefix: string,
    bot: MusicBot
) => Promise<void> | void;

type TextCommand = (
    interaction: ChatInputCommandInteraction,
    serverPrefix: string,
    bot: MusicBot,
    lang: Language
) => Promise<void> | void;

class InteractionCreateHandler implements ClientEventHandler {
	public name: Events.InteractionCreate = Events.InteractionCreate

	public async execute(interaction: BaseInteraction, bot: MusicBot) {
		const server = await serverRepository.getOrPut(interaction.guild!)
		const serverQueue: GuildQueue<QueueMetadata> | null = useQueue(interaction.guild!.id)
		if (!interaction.isButton()) {
			this.handleTextCommands(interaction as ChatInputCommandInteraction, server.prefix, bot, server.lang)
		} else {
			if (!serverQueue) return
			this.handleButtonCommands(interaction, serverQueue, server.prefix, bot)
		}
	}

	private readonly textCommands: { [key: string]: TextCommand } = {
		help: this.helpCommand,
		prefix: this.prefixCommand,
		language: this.langCommand,
	}

	private readonly buttonCommands: { [key: string]: ButtonCommand } = {
		pause: this.pauseCommand,
		resume: this.pauseCommand,
		increaseVolume: this.increaseVolumeCommand,
		decreaseVolume: this.decreaseVolumeCommand,
		cycle: this.cycleCommand,
		autoplay: this.autoplayCommand,
		clear: this.clearCommand,
		disconnect: this.disconnectCommand,
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
		serverPrefix: string,
		bot: MusicBot
	) {
		const { customId } = interaction

		interaction.deferUpdate().then(() => {
			if (this.buttonCommands[customId]) {
				this.buttonCommands[customId](interaction, serverQueue, serverPrefix, bot)
			} else {
				handleCommand(interaction, [`${serverPrefix}${customId}`], bot)
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
			console.error(e)
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
			console.error(e)
			return
		}

		const embed = successEmbed(null, lang.shared.set_lang.replace("{lang}", newLang))
		await interaction.reply({ embeds: [embed] })
	}

	private pauseCommand(
		interaction: ButtonInteraction,
		serverQueue: GuildQueue<QueueMetadata>,
		serverPrefix: string,
		bot: MusicBot
	) {
		const command = serverQueue.isPlaying() && !serverQueue.dispatcher!.isPaused() ? "pause" : "resume"
		handleCommand(interaction, [`${serverPrefix}${command}`], bot)
	}

	private increaseVolumeCommand(_interaction: ButtonInteraction, serverQueue: GuildQueue<QueueMetadata>) {
		const newVolume = serverQueue.node.volume === 200 ? 200 : serverQueue.node.volume + 20
		serverQueue.node.setVolume(newVolume)
	}

	private decreaseVolumeCommand(_interaction: ButtonInteraction, serverQueue: GuildQueue<QueueMetadata>) {
		const newVolume = serverQueue.node.volume === 0 ? 0 : serverQueue.node.volume - 20
		serverQueue.node.setVolume(newVolume)
	}

	private cycleCommand(
		interaction: ButtonInteraction,
		serverQueue: GuildQueue<QueueMetadata>,
		serverPrefix: string,
		bot: MusicBot
	) {
		const repeatMode = serverQueue.repeatMode !== QueueRepeatMode.TRACK ? "track" : "off"
		handleCommand(interaction, [`${serverPrefix}cycle`, repeatMode], bot)
	}

	private autoplayCommand(
		interaction: ButtonInteraction,
		serverQueue: GuildQueue<QueueMetadata>,
		serverPrefix: string,
		bot: MusicBot
	) {
		const repeatMode = serverQueue.repeatMode !== QueueRepeatMode.AUTOPLAY ? "autoplay" : "off"
		handleCommand(interaction, [`${serverPrefix}cycle`, repeatMode], bot)
	}

	private clearCommand(
		interaction: ButtonInteraction,
		_serverQueue: GuildQueue<QueueMetadata> | null,
		serverPrefix: string,
		bot: MusicBot
	) {
		handleCommand(interaction, [`${serverPrefix}clear`], bot)
	}

	private disconnectCommand(
		interaction: ButtonInteraction,
		_serverQueue: GuildQueue<QueueMetadata> | null,
		serverPrefix: string,
		bot: MusicBot
	) {
		handleCommand(interaction, [`${serverPrefix}disconnect`], bot)
	}
}

export default new InteractionCreateHandler()
