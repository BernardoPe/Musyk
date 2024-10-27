import {BaseInteraction, ButtonInteraction, ChatInputCommandInteraction, Events} from "discord.js"
import {ClientEventHandler, MusicBot, QueueMetadata, ServerPrefix} from "../../types.ts"
import {handleCommand} from "../../handlers/commands.ts"
import {helpEmbeds, createLink} from "../../utils/embeds.ts"
import {GuildQueue, QueueRepeatMode} from "discord-player"
import {getServerPrefix, setNewPrefix} from "../../utils/configs.ts"
import {successEmbed, errorEmbed} from "../../utils/embeds.ts"
import {logger} from "../../utils/logger.ts"

type ButtonCommand = (interaction: ButtonInteraction, bot: MusicBot, serverQueue: GuildQueue<QueueMetadata> | null, serverPrefix: ServerPrefix) => Promise<void>
type TextCommand = (interaction: ChatInputCommandInteraction, bot: MusicBot, serverQueue: GuildQueue<QueueMetadata> | null, serverPrefix: ServerPrefix) => Promise<void>

class InteractionCreateHandler implements ClientEventHandler {
	public name: Events.InteractionCreate = Events.InteractionCreate

	public async execute(interaction: BaseInteraction, bot: MusicBot) {
		const serverPrefix = getServerPrefix(interaction.guild!.id)
		const serverQueue: GuildQueue<QueueMetadata> | null = bot.player.nodes.get(interaction.guild!.id)
		if (!interaction.isButton()) {
			await this.handleTextCommands(interaction as ChatInputCommandInteraction, bot, serverQueue, serverPrefix)
		} else {
			await this.handleButtonCommands(interaction, bot, serverQueue, serverPrefix)
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

	private async handleTextCommands(interaction: ChatInputCommandInteraction, bot: MusicBot, serverQueue: GuildQueue<QueueMetadata> | null, serverPrefix: ServerPrefix) {
		const {commandName} = interaction as ChatInputCommandInteraction
		if (this.textCommands[commandName]) {
			console.log(commandName)
			await this.textCommands[commandName](interaction, bot, serverQueue, serverPrefix)
		}
	}

	private async handleButtonCommands(interaction: ButtonInteraction, bot: MusicBot, serverQueue: GuildQueue<QueueMetadata> | null, serverPrefix: ServerPrefix) {

		const {customId} = interaction

		await interaction.deferUpdate()

		if (this.buttonCommands[customId]) {
			await this.buttonCommands[customId](
				interaction,
				bot,
				serverQueue,
				serverPrefix,
			)
		} else {
			console.log(serverPrefix + customId)
			await handleCommand(interaction, [`${serverPrefix}${customId}`], bot)
		}

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

	private async prefixCommand(interaction: ChatInputCommandInteraction, bot: MusicBot, serverQueue: GuildQueue<QueueMetadata> | null , serverPrefix: ServerPrefix) {

		const newPrefix = interaction.options.get("prefix")!.value as string

		if (newPrefix === "current" || newPrefix === "curr") {
			const embed = successEmbed(null, "Current prefix is **" + serverPrefix + "**")
			await interaction.reply({embeds: [embed], ephemeral: true})
		}

		try {
			setNewPrefix(interaction.guild!.id, newPrefix)
		} catch (e) {
			const embed = errorEmbed(null, "An error occurred while setting the prefix")
			await interaction.reply({embeds: [embed], ephemeral: true})
			logger.error(e)
		}

		const embed = successEmbed(null, "Prefix set to **" + newPrefix + "**")
		await interaction.reply({embeds: [embed]})
	}

	private async pauseCommand(interaction: ButtonInteraction, bot: MusicBot, serverQueue: GuildQueue<QueueMetadata> | null, serverPrefix: ServerPrefix) {
		if (!serverQueue) return
		const command = serverQueue.isPlaying() && !serverQueue.dispatcher!.isPaused() ? "pause" : "resume"
		await handleCommand(interaction, [`${serverPrefix}${command}`], bot)
	}

	private async increaseVolumeCommand(interaction: ButtonInteraction, bot: MusicBot, serverQueue: GuildQueue<QueueMetadata> | null, serverPrefix: ServerPrefix) {
		if (!serverQueue) return
		const newVolume = serverQueue.node.volume === 200 ? 200 : serverQueue.node.volume + 20
		serverQueue.node.setVolume(newVolume)
	}

	private async decreaseVolumeCommand(interaction: ButtonInteraction, bot: MusicBot, serverQueue: GuildQueue<QueueMetadata> | null, serverPrefix: ServerPrefix) {
		if (!serverQueue) return
		const newVolume = serverQueue.node.volume === 0 ? 0 : serverQueue.node.volume - 20
		serverQueue.node.setVolume(newVolume)
	}

	private async cycleCommand(interaction: ButtonInteraction, bot: MusicBot, serverQueue: GuildQueue<QueueMetadata> | null, serverPrefix: ServerPrefix) {
		if (!serverQueue) return
		const repeatMode = serverQueue.repeatMode !== QueueRepeatMode.TRACK ? "track" : "off"
		await handleCommand(interaction, [`${serverPrefix}cycle`, repeatMode], bot)
	}

	private async autoplayCommand(interaction: ButtonInteraction, bot: MusicBot, serverQueue: GuildQueue<QueueMetadata> | null, serverPrefix: ServerPrefix) {
		if (!serverQueue) return
		const repeatMode = serverQueue.repeatMode !== QueueRepeatMode.AUTOPLAY ? "autoplay" : "off"
		await handleCommand(interaction, [`${serverPrefix}cycle`, repeatMode], bot)
	}

	private async clearCommand(interaction: ButtonInteraction, bot: MusicBot, serverQueue: GuildQueue<QueueMetadata> | null, serverPrefix: ServerPrefix) {
		if (!serverQueue) return
		await handleCommand(interaction, [`${serverPrefix}clear`], bot)
	}

	private async disconnectCommand(interaction: ButtonInteraction, bot: MusicBot, serverQueue: GuildQueue<QueueMetadata> | null, serverPrefix: ServerPrefix) {
		if (!serverQueue) return
		await handleCommand(interaction, [`${serverPrefix}disconnect`], bot)
	}

}

export default new InteractionCreateHandler()
