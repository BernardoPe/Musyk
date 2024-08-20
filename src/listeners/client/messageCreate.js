const { Events } = require("discord.js")
const commandHandler = require("../../handlers/commands.js")

module.exports = {
	name: Events.MessageCreate,
	execute: async (msg, bot) => {
		if (msg.author.bot) return

		const args = msg.content.split(" ")

		await commandHandler(msg, args, bot)
	},
}
