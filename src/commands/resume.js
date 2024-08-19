const { sendEmbed, errorEmbed, successEmbed} = require("../utils/embeds")

module.exports = {
	aliases: ["resume"],
	name: "resume",
	requiresPlayer: true,
	execute: async (msg, args, bot, serverQueue) => {
		if (serverQueue && !serverQueue.dispatcher.isPaused()) {
			const embed = errorEmbed(undefined, "The player is not paused")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}
		if (serverQueue && serverQueue.dispatcher.isPaused()) {
			serverQueue.dispatcher.resume()
			const embed = successEmbed(undefined, "Resumed the player")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}
	},
}
