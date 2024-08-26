const { sendEmbed, updatePlayer, successEmbed, errorEmbed} = require("../utils/embeds")

module.exports = {
	aliases: ["shuffle"],
	name: "shuffle",
	requiresPlayer: true,
	execute: async (msg, args, bot, serverQueue) => {

		if (serverQueue.tracks.size < 2) {
			const embed = errorEmbed(undefined, "There are not enough songs in the queue to shuffle")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		serverQueue.tracks.shuffle()

		updatePlayer(serverQueue)

		const embed = successEmbed(undefined, "Shuffled the queue")

		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
