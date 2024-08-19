const { sendEmbed, errorEmbed} = require("../utils/embeds")

module.exports = {
	aliases: ["skipto"],
	name: "skipto",
	requiresPlayer: true,
	execute: async (msg, args, bot, serverQueue) => {
		const skipPos = parseInt(args[1])

		if (isNaN(skipPos) || skipPos < 1 || skipPos > serverQueue.tracks.size) {
			const embed = errorEmbed(undefined, "Invalid position")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		serverQueue.node.skipTo(skipPos - 1)
	},
}
