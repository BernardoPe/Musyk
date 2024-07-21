const { sendEmbed, Color } = require("../utils/embeds")

module.exports = {
	aliases: ["resume"],
	name: "resume",
	requiresPlayer: true,
	execute: async (msg, args, embed, bot, serverQueue) => {
		if (serverQueue && !serverQueue.dispatcher.isPaused()) {
			embed.setColor(Color.RED).setDescription("The player is not paused")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}
		if (serverQueue && serverQueue.dispatcher.isPaused()) {
			embed.setColor(Color.BLUE).setDescription("Resumed current song")
			serverQueue.dispatcher.resume()
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}
	},
}
