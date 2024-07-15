const { Util } = require("discord-player")
const { sendEmbed } = require("../utils/embeds")

module.exports = {
	aliases: ["skip"],
	name: "skip",
	requiresPlayer: true,
	execute: async (msg, args, embed, bot, serverQueue) => {
		while (serverQueue.dispatcher.isBuffering()) {
			await Util.wait(5)
		}
		return serverQueue.node.skip()
	},
}
