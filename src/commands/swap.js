const { sendEmbed, updatePlayer, Color} = require("../utils/embeds")

module.exports = {
	aliases: ["swap"],
	name: "swap",
	requiresPlayer: true,
	execute: async (msg, args, embed, bot, serverQueue) => {
		const swapPos1 = parseInt(args[1])
		const swapPos2 = parseInt(args[2])  

		if (isNaN(swapPos1) || swapPos1 < 1 || swapPos1 > serverQueue.tracks.size) {
			embed.setDescription("Invalid position 1 provided")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		if (isNaN(swapPos2) || swapPos2 < 1 || swapPos2 > serverQueue.tracks.size) {
			embed.setDescription("Invalid position 2 provided")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		serverQueue.node.swap(swapPos1 - 1, swapPos2 - 1)

		const tracks = serverQueue.tracks.toArray()
		const song1 = tracks[swapPos1 - 1]
		const song2 = tracks[swapPos2 - 1]

		embed.setDescription(`Swapped **[${song1.cleanTitle}](${song1.url})** with **[${song2.cleanTitle}](${song2.url})**`)
			.setColor(Color.BLUE)
		sendEmbed(msg.channel, { embeds: [embed] }, 20000)

		if (swapPos1 === 1 || swapPos2 === 1) updatePlayer(serverQueue)
	}
}
