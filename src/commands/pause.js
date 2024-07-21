const { sendEmbed, Color } = require("../utils/embeds")

module.exports = {
	aliases: ["pause"],
	name: "pause",
	requiresPlayer: true,
	execute: async (msg, args, embed, bot, serverQueue) => {
		if (serverQueue.dispatcher.paused) {
			embed.setColor(Color.RED).setDescription("The player is already paused")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}
		embed.setColor(Color.BLUE).setDescription("Paused current song")
		serverQueue.dispatcher.pause()
		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
