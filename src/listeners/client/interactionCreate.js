const { Events, EmbedBuilder } = require("discord.js")
const commandHandler = require("../../handlers/commands.js")
const { helpEmbeds, createLink } = require("../../utils/embeds.js")

const {
	getServerPrefixFromJson,
	setNewPrefix,
} = require("../../utils/configs.js")

module.exports = {
	name: Events.InteractionCreate,
	execute: async (interaction, bot) => {
		const serverPrefix = getServerPrefixFromJson(interaction.guild.id)
		const serverQueue = bot.player.nodes.get(interaction.guild.id)
		const embed = new EmbedBuilder()
		if (!interaction.isButton()) {
			await handleTextCommands(interaction, bot, serverQueue, serverPrefix, embed)
		} else {
			await handleButtonCommands(interaction, bot, serverQueue, serverPrefix, embed)
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
}

async function handleTextCommands(interaction, bot, serverQueue, serverPrefix, embed) {
	if (interaction.isChatInputCommand) {
		const { commandName } = interaction
		if (textCommands[commandName]) {
			await textCommands[commandName](interaction, bot, serverQueue, serverPrefix, embed)
		}
	}
}

async function handleButtonCommands(interaction, bot, serverQueue, serverPrefix, embed){

	const { customId } = interaction

	await interaction.deferUpdate()

	if (buttonCommands[customId]) {
		await buttonCommands[customId](
			interaction,
			bot,
			serverQueue,
			serverPrefix,
			embed,
		)
	} else {
		await commandHandler(interaction, [`${serverPrefix}${customId}`], embed, bot)
	}

}

async function helpCommand(interaction, bot, serverQueue, serverPrefix, embed) {
	embed = helpEmbeds()
	const link = createLink()
	await interaction.reply({
		embeds: embed,
		components: [link],
		ephemeral: true,
	})
}

async function prefixCommand(interaction, bot, serverQueue, serverPrefix, embed) {

	let newPrefix = interaction.options.get("prefix").value

	if (newPrefix === "current" || newPrefix === "curr") {
		embed.setDescription("The current prefix is **" + serverPrefix + "**")
		return interaction.reply({ embeds: [embed], ephemeral: true })
	}

	try {
		setNewPrefix(interaction.guild.id, newPrefix)
	} catch (err) {
		embed.setDescription("There was an error while saving the new prefix")
		console.error(err)
		return interaction.reply({ embeds: [embed], ephemeral: true })
	}

	embed.setDescription("Prefix successfully set to **" + newPrefix + "**")
	return interaction.reply({ embeds: [embed] })
}

async function pauseCommand(interaction, bot, serverQueue, serverPrefix, embed) {
	const command = serverQueue.isPlaying() && !serverQueue.dispatcher.isPaused() ? "pause" : "resume"
	await commandHandler(interaction, [`${serverPrefix}${command}`], embed, bot)
}

async function increaseVolumeCommand(interaction, bot, serverQueue, serverPrefix, embed) {
	if (!serverQueue) return
	const newVolume = serverQueue.node.volume === 200 ? 200 : serverQueue.node.volume + 20
	serverQueue.node.setVolume(newVolume)
}

async function decreaseVolumeCommand(interaction, bot, serverQueue, serverPrefix, embed) {
	const newVolume = serverQueue.node.volume === 0 ? 0 : serverQueue.node.volume - 20
	serverQueue.node.setVolume(newVolume)
}

async function cycleCommand(interaction, bot, serverQueue, serverPrefix, embed) {
	const repeatMode = serverQueue.repeatMode !== 1 ? "track" : "off"
	await commandHandler(interaction, [`${serverPrefix}cycle`, repeatMode], embed, bot)
}

async function autoplayCommand(interaction, bot, serverQueue, serverPrefix, embed) {
	const repeatMode = serverQueue.repeatMode !== 3 ? "autoplay" : "off"
	await commandHandler(interaction, [`${serverPrefix}cycle`, repeatMode], embed, bot)
}