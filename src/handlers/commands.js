const { getAllFiles, getServerPrefixFromJson, getAdminsFromJson } = require("../utils/configs.js")
const { sendEmbed } = require("../utils/embeds.js")
const path = require("node:path")
const winston = require("../utils/logger.js")
const { ButtonInteraction } = require("discord.js")
const {errorEmbed} = require("../utils/embeds")

const commands = {}
const commandFiles = getAllFiles(path.join(__dirname, "../commands"))

commandFiles.forEach((file) => {
	const command = require(file)
	command.aliases.forEach((alias) => (commands[alias] = command))
})

module.exports = async (msg, args, bot) => {
	const prefix = getServerPrefixFromJson(msg.guild.id)

	if (msg.content && !msg.content.startsWith(prefix)) return

	const commandName = args[0].slice(prefix.length).toLowerCase()

	if (commands.hasOwnProperty(commandName)) {

		const command = commands[commandName]
		const serverQueue = bot.player.nodes.get(msg.guild.id)

		if (command.adminCommand) {
			const admins = getAdminsFromJson()
			if (!admins.includes(msg.author.id)) return
		}
		
		if (command.requiresPlayer && (!serverQueue || !serverQueue.isPlaying())) {
			const embed = errorEmbed(undefined, "Not currently playing any songs")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		command.msg = msg.content
		command.user = msg instanceof ButtonInteraction ? msg.user.username : msg.author.username
		command.guild = msg.guild.name

		winston.logger.info(
			`[COMMAND]: ${command.name} | ${command.msg} | User: ${command.user} | Guild: ${command.guild}`,
		)

		await command.execute(
			msg,
			args.filter((str) => {
				return str.trim() !== ""
			}),
			bot,
			serverQueue,
		)
	}

}
