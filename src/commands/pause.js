const { sendEmbed, errorEmbed, successEmbed} = require("../utils/embeds")

module.exports = {
	aliases: ["pause"],
	name: "pause",
	requiresPlayer: true,
	execute: async (msg, args, bot, serverQueue) => {
		if (serverQueue.dispatcher.paused) {
			const embed = errorEmbed(undefined, "The player is already paused")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}
		const embed = successEmbed(undefined, "Paused the player")
		serverQueue.dispatcher.pause()
		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
