const {updatePlayer, errorEmbed, sendEmbed, successEmbed} = require("../utils/embeds")
module.exports = {
	aliases: ["clear"],
	name: "clear",
	requiresPlayer: true,
	execute: async (msg, args, bot, serverQueue) => {
		if (serverQueue.tracks.size === 0) {
			const embed = errorEmbed(undefined, "There are no songs in the queue")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}
		serverQueue.tracks.clear()
		updatePlayer(serverQueue)
		const embed = successEmbed(undefined, "Cleared the queue")
		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}