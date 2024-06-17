const { Events, EmbedBuilder } = require("discord.js")
const commandHandler = require("../../handlers/commands.js")

module.exports = {
	name: Events.MessageCreate,
	execute: async (msg, bot) => {
		if (msg.author.bot) return

		const embed = new EmbedBuilder()

		const args = msg.content.split(" ")

		await commandHandler(msg, args, embed, bot)
	},
}
