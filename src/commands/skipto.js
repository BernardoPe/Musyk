const { sendEmbed } = require("../utils/embeds")

module.exports = {
	aliases: ["skipto"],
	name: "skipto",
	requiresPlayer: true,
	execute: async (msg, args, embed, bot, serverQueue) => {
		const skipPos = parseInt(args[1])

		if (isNaN(skipPos) || skipPos < 1 || skipPos > serverQueue.tracks.size) {
			embed.setDescription("Invalid queue position")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		serverQueue.node.skipTo(skipPos - 1)
	},
}
