const { Util } = require("discord-player")
const { sendEmbed } = require("../utils/embeds")

module.exports = {
	aliases: ["jump"],
	name: "jump",
	requiresPlayer: true,
	execute: async (msg, args, embed, bot, serverQueue) => {
		const jumpPosition = parseInt(args[1])

		if (isNaN(jumpPosition) || jumpPosition < 1 || jumpPosition > serverQueue.tracks.size) {
			embed.setDescription("Invalid queue position")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		serverQueue.node.jump(jumpPosition - 1)
	},
}
