const { sendEmbed, updatePlayer, successEmbed, errorEmbed} = require("../utils/embeds")

module.exports = {
	aliases: ["reverse"],
	name: "reverse",
	requiresPlayer: true,
	execute: async (msg, args, bot, serverQueue) => {

		if (serverQueue.isEmpty()) {
			const embed = errorEmbed(undefined, "Queue is empty")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		if (serverQueue.tracks.size === 1) {
			const embed = errorEmbed(undefined, "Queue has only one song")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		reverse(serverQueue, serverQueue.tracks.toArray())

		updatePlayer(serverQueue)

		const embed = successEmbed(undefined, "Reversed the queue")

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
