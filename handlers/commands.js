const { getAllFiles, getServerPrefixFromJson } = require("../utils/configs.js")
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

	if (!msg.content.startsWith(PREFIX)) return

	const commandName = args[0].slice(PREFIX.length).toLowerCase()

	if (commands.hasOwnProperty(commandName)) {
		const command = commands[commandName]

		command.msg = msg.content
		command.user = msg.author.tag
		command.guild = msg.guild.name

		winston.logger.info(
			`[COMMAND]: ${command.msg} | User: ${command.user} | Guild: ${command.guild}`,
		)

		await command.execute(
			msg,
			args.filter((str) => {
				return str.trim() !== ""
			}),
			embed,
			bot,
		)
	}

	return undefined
}
