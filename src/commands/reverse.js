const { sendEmbed, updatePlayer } = require("../utils/embeds")

module.exports = {
	aliases: ["reverse"],
	name: "reverse",
	requiresPlayer: true,
	execute: async (msg, args, embed, bot, serverQueue) => {
		reverse(serverQueue, serverQueue.tracks.toArray())

		updatePlayer(serverQueue)

		embed.setDescription("Reversed Queue")

		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}

function reverse(serverQueue, array) {
	let r = array.length - 1
	let l = 0

	while (l < r) {
		serverQueue.node.swap(array[l], array[r])
		l++
		r--
	}

	return array
}
