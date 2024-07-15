const { sendEmbed } = require("../utils/embeds")

module.exports = {
	aliases: ["resume"],
	name: "resume",
	requiresPlayer: true,
	execute: async (msg, args, embed, bot, serverQueue) => {
		if (serverQueue && !serverQueue.dispatcher.isPaused()) {
			embed.setColor(0xed4245).setDescription("The player is not paused")
			return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}
		if (serverQueue && serverQueue.dispatcher.isPaused()) {
			embed.setColor(0x01ff34).setDescription("Resumed current song")
			serverQueue.dispatcher.resume()
			return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}
	},
}
