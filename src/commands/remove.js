const { sendEmbed, updatePlayer, errorEmbed, successEmbed} = require("../utils/embeds")

module.exports = {
	aliases: ["remove"],
	name: "remove",
	requiresPlayer: true,
	execute: async (msg, args, bot, serverQueue) => {

		const value = parseInt(args[1])

		if (isNaN(value)) {
			const embed = errorEmbed(undefined, "Value must be a number")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		const tracks = serverQueue.tracks.toArray()

		if (value < 1 || value > tracks.length) {
			const embed = errorEmbed(undefined, `Invalid number, must be 1-${tracks.length}`)
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		const song = serverQueue.node.remove(tracks[value - 1])

		const embed = successEmbed(undefined, `Removed [${song.title}](${song.url}) from the queue`)

		updatePlayer(serverQueue)

		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
