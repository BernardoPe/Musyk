const { Util } = require("discord-player")
const { sendEmbed } = require("../utils/embeds")

module.exports = {
	aliases: ["pause"],
	name: "pause",
	requiresPlayer: true,
	execute: async (msg, args, embed, bot, serverQueue) => {
		while (serverQueue.dispatcher.isBuffering()) {
			await Util.wait(5)
		}
		if (serverQueue.dispatcher.paused) {
			embed.setColor(0xed4245).setDescription("The player is already paused")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}
		embed.setColor(0x01ff34).setDescription("Paused current song")
		serverQueue.dispatcher.pause()
		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
