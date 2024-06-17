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
		if (!interaction.isButton()) {
			return await handleTextCommands(interaction)
		}

		await handleButtonCommands(interaction, bot)
	},
}

async function handleTextCommands(interaction) {
	if (interaction.isChatInputCommand && interaction.commandName === "help") {
		let embed = helpEmbeds()
		let link = createLink()
		await interaction.reply({
			embeds: embed,
			components: [link],
			ephemeral: true,
		})
	} else if (
		interaction.isChatInputCommand &&
        interaction.commandName === "prefix"
	) {
		let embed = new EmbedBuilder()

		let prefix = getServerPrefixFromJson(interaction.guild.id)

		let newPrefix = interaction.options.get("prefix").value

		embed.setDescription(`Current prefix is ${prefix}`)

		if (newPrefix === "current" || newPrefix === "curr")
			return interaction.reply({ embeds: [embed], ephemeral: true })

		try {
			setNewPrefix(interaction.guild.id, newPrefix)
		} catch (err) {
			embed.setDescription("There was an error while saving the new prefix")
			console.log(err)
			return interaction.reply({ embeds: [embed], ephemeral: true })
		}

		embed.setDescription("Prefix successfully set to **" + newPrefix + "**")
		return interaction.reply({ embeds: [embed] })
	}
}

async function handleButtonCommands(interaction, bot) {
	const { customId } = interaction

	const serverPrefix = getServerPrefixFromJson(interaction.guild.id)
	const serverQueue = bot.player.nodes.get(interaction.guild.id)
	const embed = new EmbedBuilder()

	await interaction.deferUpdate()

	switch (customId) {
	case "pause":
		if (serverQueue.isPlaying() && !serverQueue.dispatcher.isPaused())
			await commandHandler(
				interaction,
				[`${serverPrefix}${"pause"}`],
				embed,
				bot,
			)
		else
			await commandHandler(
				interaction,
				[`${serverPrefix}${"resume"}`],
				embed,
				bot,
			)
		break

	case "increaseVolume":
		if (!serverQueue) break
		if (serverQueue.node.volume >= 180) {
			serverQueue.node.setVolume(
				serverQueue.node.volume + (200 - serverQueue.node.volume),
			)
			return
		}
		serverQueue.node.setVolume(serverQueue.node.volume + 20)
		break

	case "decreaseVolume":
		if (serverQueue.node.volume <= 20) {
			serverQueue.node.setVolume(
				serverQueue.node.volume + (0 - serverQueue.node.volume),
			)
			return
		}
		serverQueue.node.setVolume(serverQueue.node.volume - 20)
		break

	case "cycle":
		if (serverQueue.repeatMode !== 1)
			await commandHandler(
				interaction,
				[`${serverPrefix}${customId}`, "track"],
				embed,
				bot,
			)
		else
			await commandHandler(
				interaction,
				[`${serverPrefix}${customId}`, "off"],
				embed,
				bot,
			)

		break

	case "autoplay":
		if (serverQueue.repeatMode !== 3)
			await commandHandler(
				interaction,
				[`${serverPrefix}cycle`, "autoplay"],
				embed,
				bot,
			)
		else
			await commandHandler(
				interaction,
				[`${serverPrefix}cycle`, "off"],
				embed,
				bot,
			)

		break

	default:
		await commandHandler(
			interaction,
			[`${serverPrefix}${customId}`],
			embed,
			bot,
		)
	}
}
