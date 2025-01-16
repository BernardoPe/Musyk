import { BaseInteraction, ButtonInteraction, ChatInputCommandInteraction, Events } from "discord.js"
import { ClientEventHandler, MusicBot, QueueMetadata, ServerPrefix } from "../../types.ts"
import { handleCommand } from "../../handlers/commands.ts"
import { GuildQueue, QueueRepeatMode, useQueue } from "discord-player"
import { logger } from "../../utils/logging/logger.ts"
import { errorEmbed, successEmbed } from "../../utils/embeds/status.ts"
import { helpEmbeds } from "../../utils/embeds/help.ts"
import { createLink } from "../../utils/embeds/links.ts"
import { getServerPrefix, setNewPrefix } from "../../utils/configs/server.ts"
import langs from "../../langs"

type ButtonCommand = (
    interaction: ButtonInteraction,
    serverQueue: GuildQueue<QueueMetadata>,
    serverPrefix: ServerPrefix,
    bot: MusicBot
) => void;

type TextCommand = (
    interaction: ChatInputCommandInteraction,
    serverQueue: GuildQueue<QueueMetadata>,
    serverPrefix: ServerPrefix,
    bot: MusicBot
) => void;

class InteractionCreateHandler implements ClientEventHandler {
	public name: Events.InteractionCreate = Events.InteractionCreate

	public execute(interaction: BaseInteraction, bot: MusicBot) {
		const serverPrefix = getServerPrefix(interaction.guild!.id)
		const serverQueue: GuildQueue<QueueMetadata> | null = useQueue(interaction.guild!.id)
		if (!serverQueue) return
		if (!interaction.isButton()) {
			this.handleTextCommands(interaction as ChatInputCommandInteraction, serverQueue, serverPrefix, bot)
		} else {
			this.handleButtonCommands(interaction, serverQueue, serverPrefix, bot)
		}
	}

	private textCommands: { [key: string]: TextCommand } = {
		help: this.helpCommand,
		prefix: this.prefixCommand,
	}

	private buttonCommands: { [key: string]: ButtonCommand } = {
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
		serverQueue: GuildQueue<QueueMetadata>,
		serverPrefix: ServerPrefix,
		bot: MusicBot
	) {
		const { commandName } = interaction as ChatInputCommandInteraction
		if (this.textCommands[commandName]) {
			this.textCommands[commandName](interaction, serverQueue, serverPrefix, bot)
		}
	}

	private handleButtonCommands(
		interaction: ButtonInteraction,
		serverQueue: GuildQueue<QueueMetadata>,
		serverPrefix: ServerPrefix,
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

	private async helpCommand(interaction: ChatInputCommandInteraction) {
		const embed = helpEmbeds()
		const link = createLink()
		await interaction.reply({
			embeds: embed,
			components: [link],
			flags: "Ephemeral",
		})
	}

	private async prefixCommand(
		interaction: ChatInputCommandInteraction,
		serverQueue: GuildQueue<QueueMetadata>,
		serverPrefix: ServerPrefix
	) {
		const newPrefix = interaction.options.get("prefix")!.value as string

		if (newPrefix === "current" || newPrefix === "curr") {
			const embed = successEmbed(null, langs.en.shared.current_prefix.replace("{prefix}", serverPrefix))
			await interaction.reply({ embeds: [embed], flags: "Ephemeral" })
		}

		try {
			setNewPrefix(interaction.guild!.id, newPrefix)
		} catch (e) {
			const embed = errorEmbed(null, langs.en.shared.set_prefix_error)
			await interaction.reply({ embeds: [embed], flags: "Ephemeral" })
			logger.error(e)
		}

		const embed = successEmbed(null, langs.en.shared.set_prefix.replace("{prefix}", newPrefix))
		await interaction.reply({ embeds: [embed] })
	}

	private pauseCommand(
		interaction: ButtonInteraction,
		serverQueue: GuildQueue<QueueMetadata>,
		serverPrefix: ServerPrefix,
		bot: MusicBot
	) {
		const command = serverQueue.isPlaying() && !serverQueue.dispatcher!.isPaused() ? "pause" : "resume"
		handleCommand(interaction, [`${serverPrefix}${command}`], bot)
	}

	private increaseVolumeCommand(interaction: ButtonInteraction, serverQueue: GuildQueue<QueueMetadata>) {
		const newVolume = serverQueue.node.volume === 200 ? 200 : serverQueue.node.volume + 20
		serverQueue.node.setVolume(newVolume)
	}

	private decreaseVolumeCommand(interaction: ButtonInteraction, serverQueue: GuildQueue<QueueMetadata>) {
		const newVolume = serverQueue.node.volume === 0 ? 0 : serverQueue.node.volume - 20
		serverQueue.node.setVolume(newVolume)
	}

	private cycleCommand(
		interaction: ButtonInteraction,
		serverQueue: GuildQueue<QueueMetadata>,
		serverPrefix: ServerPrefix,
		bot: MusicBot
	) {
		const repeatMode = serverQueue.repeatMode !== QueueRepeatMode.TRACK ? "track" : "off"
		handleCommand(interaction, [`${serverPrefix}cycle`, repeatMode], bot)
	}

	private autoplayCommand(
		interaction: ButtonInteraction,
		serverQueue: GuildQueue<QueueMetadata>,
		serverPrefix: ServerPrefix,
		bot: MusicBot
	) {
		const repeatMode = serverQueue.repeatMode !== QueueRepeatMode.AUTOPLAY ? "autoplay" : "off"
		handleCommand(interaction, [`${serverPrefix}cycle`, repeatMode], bot)
	}

	private clearCommand(
		interaction: ButtonInteraction,
		serverQueue: GuildQueue<QueueMetadata> | null,
		serverPrefix: ServerPrefix,
		bot: MusicBot
	) {
		handleCommand(interaction, [`${serverPrefix}clear`], bot)
	}

	private disconnectCommand(
		interaction: ButtonInteraction,
		serverQueue: GuildQueue<QueueMetadata> | null,
		serverPrefix: ServerPrefix,
		bot: MusicBot
	) {
		handleCommand(interaction, [`${serverPrefix}disconnect`], bot)
	}
}

export default new InteractionCreateHandler()
