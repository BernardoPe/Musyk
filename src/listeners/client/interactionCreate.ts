import { BaseInteraction, ButtonInteraction, ChatInputCommandInteraction, Events } from "discord.js"
import { ClientEventHandler, QueueMetadata, ServerPrefix } from "../../types.ts"
import { handleCommand } from "../../handlers/commands.ts"
import { GuildQueue, QueueRepeatMode, useQueue } from "discord-player"
import { logger } from "../../utils/logging/logger.ts"
import { errorEmbed, successEmbed } from "../../utils/embeds/status.ts"
import { helpEmbeds } from "../../utils/embeds/help.ts"
import { createLink } from "../../utils/embeds/links.ts"
import { getServerPrefix, setNewPrefix } from "../../utils/configs/server.ts"

type ButtonCommand = (
    interaction: ButtonInteraction,
    serverQueue: GuildQueue<QueueMetadata>,
    serverPrefix: ServerPrefix
) => void;

type TextCommand = (
    interaction: ChatInputCommandInteraction,
    serverQueue: GuildQueue<QueueMetadata>,
    serverPrefix: ServerPrefix
) => void;

class InteractionCreateHandler implements ClientEventHandler {
	public name: Events.InteractionCreate = Events.InteractionCreate

	public execute(interaction: BaseInteraction) {
		const serverPrefix = getServerPrefix(interaction.guild!.id)
		const serverQueue: GuildQueue<QueueMetadata> | null = useQueue(interaction.guild!.id)
		if (!serverQueue) return
		if (!interaction.isButton()) {
			this.handleTextCommands(interaction as ChatInputCommandInteraction, serverQueue, serverPrefix)
		} else {
			this.handleButtonCommands(interaction, serverQueue, serverPrefix)
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
		serverPrefix: ServerPrefix
	) {
		const { commandName } = interaction as ChatInputCommandInteraction
		if (this.textCommands[commandName]) {
			this.textCommands[commandName](interaction, serverQueue, serverPrefix)
		}
	}

	private handleButtonCommands(
		interaction: ButtonInteraction,
		serverQueue: GuildQueue<QueueMetadata>,
		serverPrefix: ServerPrefix
	) {
		const { customId } = interaction

		interaction.deferUpdate().then(() => {
			if (this.buttonCommands[customId]) {
				this.buttonCommands[customId](interaction, serverQueue, serverPrefix)
			} else {
				handleCommand(interaction, [`${serverPrefix}${customId}`])
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
			const embed = successEmbed(null, "Current prefix is **" + serverPrefix + "**")
			await interaction.reply({ embeds: [embed], flags: "Ephemeral" })
		}

		try {
			setNewPrefix(interaction.guild!.id, newPrefix)
		} catch (e) {
			const embed = errorEmbed(null, "An error occurred while setting the prefix")
			await interaction.reply({ embeds: [embed], flags: "Ephemeral" })
			logger.error(e)
		}

		const embed = successEmbed(null, "Prefix set to **" + newPrefix + "**")
		await interaction.reply({ embeds: [embed] })
	}

	private pauseCommand(
		interaction: ButtonInteraction,
		serverQueue: GuildQueue<QueueMetadata>,
		serverPrefix: ServerPrefix
	) {
		const command = serverQueue.isPlaying() && !serverQueue.dispatcher!.isPaused() ? "pause" : "resume"
		handleCommand(interaction, [`${serverPrefix}${command}`])
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
		serverPrefix: ServerPrefix
	) {
		const repeatMode = serverQueue.repeatMode !== QueueRepeatMode.TRACK ? "track" : "off"
		handleCommand(interaction, [`${serverPrefix}cycle`, repeatMode])
	}

	private autoplayCommand(
		interaction: ButtonInteraction,
		serverQueue: GuildQueue<QueueMetadata>,
		serverPrefix: ServerPrefix
	) {
		const repeatMode = serverQueue.repeatMode !== QueueRepeatMode.AUTOPLAY ? "autoplay" : "off"
		handleCommand(interaction, [`${serverPrefix}cycle`, repeatMode])
	}

	private clearCommand(
		interaction: ButtonInteraction,
		serverQueue: GuildQueue<QueueMetadata> | null,
		serverPrefix: ServerPrefix
	) {
		handleCommand(interaction, [`${serverPrefix}clear`])
	}

	private disconnectCommand(
		interaction: ButtonInteraction,
		serverQueue: GuildQueue<QueueMetadata> | null,
		serverPrefix: ServerPrefix
	) {
		handleCommand(interaction, [`${serverPrefix}disconnect`])
	}
}

export default new InteractionCreateHandler()
