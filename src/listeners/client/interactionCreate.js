const { Events } = require("discord.js")
const commandHandler = require("../../handlers/commands.js")
const { helpEmbeds, createLink } = require("../../utils/embeds.js")
const { QueueRepeatMode } = require("discord-player")

const {
	getServerPrefixFromJson,
	setNewPrefix,
} = require("../../utils/configs.js")
const {successEmbed, errorEmbed} = require("../../utils/embeds")

module.exports = {
	name: Events.InteractionCreate,
	execute: async (interaction, bot) => {
		const serverPrefix = getServerPrefixFromJson(interaction.guild.id)
		const serverQueue = bot.player.nodes.get(interaction.guild.id)
		if (!interaction.isButton()) {
			await handleTextCommands(interaction, bot, serverQueue, serverPrefix)
		} else {
			await handleButtonCommands(interaction, bot, serverQueue, serverPrefix)
		}
	},
}

const textCommands = {
	help: helpCommand,
	prefix: prefixCommand,
}

const buttonCommands = {
	pause: pauseCommand,
	resume: pauseCommand,
	increaseVolume: increaseVolumeCommand,
	decreaseVolume: decreaseVolumeCommand,
	cycle: cycleCommand,
	autoplay: autoplayCommand,
	clear: clearCommand,
	disconnect: disconnectCommand,
}

async function handleTextCommands(interaction, bot, serverQueue, serverPrefix) {
	if (interaction.isChatInputCommand) {
		const { commandName } = interaction
		if (textCommands[commandName]) {
			await textCommands[commandName](interaction, bot, serverQueue, serverPrefix)
		}
	}
}

async function handleButtonCommands(interaction, bot, serverQueue, serverPrefix){

	const { customId } = interaction

	await interaction.deferUpdate()

	if (buttonCommands[customId]) {
		await buttonCommands[customId](
			interaction,
			bot,
			serverQueue,
			serverPrefix,
		)
	} else {
		await commandHandler(interaction, [`${serverPrefix}${customId}`], bot)
	}

}

async function helpCommand(interaction) {
	const embed = helpEmbeds()
	const link = createLink()
	await interaction.reply({
		embeds: embed,
		components: [link],
		ephemeral: true,
	})
}

async function prefixCommand(interaction, bot, serverQueue, serverPrefix) {

	let newPrefix = interaction.options.get("prefix").value

	if (newPrefix === "current" || newPrefix === "curr") {
		const embed = successEmbed(undefined, "Current prefix is **" + serverPrefix + "**")
		return interaction.reply({ embeds: [embed], ephemeral: true })
	}

	try {
		setNewPrefix(interaction.guild.id, newPrefix)
	} catch (err) {
		const embed = errorEmbed(undefined, "An error occurred while setting the prefix")
		return interaction.reply({ embeds: [embed], ephemeral: true })
	}

	const embed = successEmbed(undefined, "Prefix set to **" + newPrefix + "**")
	return interaction.reply({ embeds: [embed] })
}

async function pauseCommand(interaction, bot, serverQueue, serverPrefix) {
	const command = serverQueue.isPlaying() && !serverQueue.dispatcher.isPaused() ? "pause" : "resume"
	await commandHandler(interaction, [`${serverPrefix}${command}`], bot)
}

async function increaseVolumeCommand(interaction, bot, serverQueue) {
	if (!serverQueue) return
	const newVolume = serverQueue.node.volume === 200 ? 200 : serverQueue.node.volume + 20
	serverQueue.node.setVolume(newVolume)
}

async function decreaseVolumeCommand(interaction, bot, serverQueue) {
	const newVolume = serverQueue.node.volume === 0 ? 0 : serverQueue.node.volume - 20
	serverQueue.node.setVolume(newVolume)
}

async function cycleCommand(interaction, bot, serverQueue, serverPrefix) {
	const repeatMode = serverQueue.repeatMode !== QueueRepeatMode.TRACK ? "track" : "off"
	await commandHandler(interaction, [`${serverPrefix}cycle`, repeatMode], bot)
}

async function autoplayCommand(interaction, bot, serverQueue, serverPrefix) {
	const repeatMode = serverQueue.repeatMode !== QueueRepeatMode.AUTOPLAY ? "autoplay" : "off"
	await commandHandler(interaction, [`${serverPrefix}cycle`, repeatMode], bot)
}

async function clearCommand(interaction, bot, serverQueue, serverPrefix) {
	await commandHandler(interaction, [`${serverPrefix}clear`], bot)
}

async function disconnectCommand(interaction, bot, serverQueue, serverPrefix) {
	await commandHandler(interaction, [`${serverPrefix}disconnect`], bot)
}