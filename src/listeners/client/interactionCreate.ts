import {
	BaseInteraction,
	ButtonInteraction,
	ChatInputCommandInteraction,
	Events,
} from "discord.js"
import {
	ClientEventHandler,
	MusicBot,
	QueueMetadata,
	ServerPrefix,
} from "../../types.ts"
import { handleCommand } from "../../handlers/commands.ts"
import { GuildQueue, QueueRepeatMode } from "discord-player"
import { logger } from "../../utils/logging/logger.ts"
import { errorEmbed, successEmbed } from "../../utils/embeds/status.ts"
import { helpEmbeds } from "../../utils/embeds/help.ts"
import { createLink } from "../../utils/embeds/links.ts"
import { getServerPrefix, setNewPrefix } from "../../utils/configs/server.ts"

type ButtonCommand = (
    interaction: ButtonInteraction,
    bot: MusicBot,
    serverQueue: GuildQueue<QueueMetadata> | null,
    serverPrefix: ServerPrefix
) => void
type TextCommand = (
    interaction: ChatInputCommandInteraction,
    bot: MusicBot,
    serverQueue: GuildQueue<QueueMetadata> | null,
    serverPrefix: ServerPrefix
) => void

class InteractionCreateHandler implements ClientEventHandler {
	public name: Events.InteractionCreate = Events.InteractionCreate

	public execute(interaction: BaseInteraction, bot: MusicBot) {
		const serverPrefix = getServerPrefix(interaction.guild!.id)
		const serverQueue: GuildQueue<QueueMetadata> | null =
            bot.player.nodes.get(interaction.guild!.id)
		if (!interaction.isButton()) {
			this.handleTextCommands(
                interaction as ChatInputCommandInteraction,
                bot,
                serverQueue,
                serverPrefix
			)
		} else {
			this.handleButtonCommands(
				interaction,
				bot,
				serverQueue,
				serverPrefix
			)
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
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata> | null,
		serverPrefix: ServerPrefix
	) {
		const { commandName } = interaction as ChatInputCommandInteraction
		if (this.textCommands[commandName]) {
			this.textCommands[commandName](
				interaction,
				bot,
				serverQueue,
				serverPrefix
			)
		}
	}

	private handleButtonCommands(
		interaction: ButtonInteraction,
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata> | null,
		serverPrefix: ServerPrefix
	) {
		const { customId } = interaction

		interaction.deferUpdate().then(() => {
			if (this.buttonCommands[customId]) {
				this.buttonCommands[customId](
					interaction,
					bot,
					serverQueue,
					serverPrefix
				)
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
			ephemeral: true,
		})
	}

	private async prefixCommand(
		interaction: ChatInputCommandInteraction,
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata> | null,
		serverPrefix: ServerPrefix
	) {
		const newPrefix = interaction.options.get("prefix")!.value as string

		if (newPrefix === "current" || newPrefix === "curr") {
			const embed = successEmbed(
				null,
				"Current prefix is **" + serverPrefix + "**"
			)
			await interaction.reply({ embeds: [embed], ephemeral: true })
		}

		try {
			setNewPrefix(interaction.guild!.id, newPrefix)
		} catch (e) {
			const embed = errorEmbed(
				null,
				"An error occurred while setting the prefix"
			)
			await interaction.reply({ embeds: [embed], ephemeral: true })
			logger.error(e)
		}

		const embed = successEmbed(null, "Prefix set to **" + newPrefix + "**")
		await interaction.reply({ embeds: [embed] })
	}

	private pauseCommand(
		interaction: ButtonInteraction,
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata> | null,
		serverPrefix: ServerPrefix
	) {
		if (!serverQueue) return
		const command =
            serverQueue.isPlaying() && !serverQueue.dispatcher!.isPaused()
            	? "pause"
            	: "resume"
		handleCommand(interaction, [`${serverPrefix}${command}`], bot)
	}

	private increaseVolumeCommand(
		interaction: ButtonInteraction,
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata> | null,
		serverPrefix: ServerPrefix
	) {
		if (!serverQueue) return
		const newVolume =
            serverQueue.node.volume === 200 ? 200 : serverQueue.node.volume + 20
		serverQueue.node.setVolume(newVolume)
	}

	private decreaseVolumeCommand(
		interaction: ButtonInteraction,
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata> | null,
		serverPrefix: ServerPrefix
	) {
		if (!serverQueue) return
		const newVolume =
            serverQueue.node.volume === 0 ? 0 : serverQueue.node.volume - 20
		serverQueue.node.setVolume(newVolume)
	}

	private cycleCommand(
		interaction: ButtonInteraction,
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata> | null,
		serverPrefix: ServerPrefix
	) {
		if (!serverQueue) return
		const repeatMode =
            serverQueue.repeatMode !== QueueRepeatMode.TRACK ? "track" : "off"
		handleCommand(interaction, [`${serverPrefix}cycle`, repeatMode], bot)
	}

	private autoplayCommand(
		interaction: ButtonInteraction,
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata> | null,
		serverPrefix: ServerPrefix
	) {
		if (!serverQueue) return
		const repeatMode =
            serverQueue.repeatMode !== QueueRepeatMode.AUTOPLAY
            	? "autoplay"
            	: "off"
		handleCommand(interaction, [`${serverPrefix}cycle`, repeatMode], bot)
	}

	private clearCommand(
		interaction: ButtonInteraction,
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata> | null,
		serverPrefix: ServerPrefix
	) {
		if (!serverQueue) return
		handleCommand(interaction, [`${serverPrefix}clear`], bot)
	}

	private disconnectCommand(
		interaction: ButtonInteraction,
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata> | null,
		serverPrefix: ServerPrefix
	) {
		if (!serverQueue) return
		handleCommand(interaction, [`${serverPrefix}disconnect`], bot)
	}
}

export default new InteractionCreateHandler()
