const { getAllFiles, getServerPrefixFromJson, getAdminsFromJson } = require("../utils/configs.js")
const { sendEmbed } = require("../utils/embeds.js")
const path = require("node:path")
const winston = require("../utils/logger.js")

const commands = {}
const commandFiles = getAllFiles(path.join(__dirname, "../commands"))

commandFiles.forEach((file) => {
	const command = require(file)
	command.aliases.forEach((alias) => (commands[alias] = command))
})

module.exports = async (msg, args, embed, bot) => {
	const PREFIX = getServerPrefixFromJson(msg.guild.id)

	if (msg.content && !msg.content.startsWith(PREFIX)) return

	const commandName = args[0].slice(PREFIX.length).toLowerCase()

	if (commands.hasOwnProperty(commandName)) {

		const command = commands[commandName]
		const serverQueue = bot.player.nodes.get(msg.guild.id)

		if (command.adminCommand) {
			const admins = getAdminsFromJson()
			if (!admins.includes(msg.author.id)) return
		}

		if (command.requiresPlayer && (!serverQueue || !serverQueue.isPlaying())) {
			embed.setColor(0xfd0033).setDescription("Not currently playing any songs")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		command.msg = msg.content
		command.user = msg.author ? msg.author.username : undefined
		command.guild = msg.guild.name

		winston.logger.info(
			`[COMMAND]: ${command.name} | ${command.msg} | User: ${command.user} | Guild: ${command.guild}`,
		)

		await command.execute(
			msg,
			args.filter((str) => {
				return str.trim() !== ""
			}),
			embed,
			bot,
			serverQueue,
		)
	}

}
