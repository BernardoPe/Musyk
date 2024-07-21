const paginate = require("../utils/paginator.js")
const { sendEmbed, createQueueEmbed, Color } = require("../utils/embeds")

module.exports = {
	aliases: ["queue"],
	name: "queue",
	requiresPlayer: true,
	execute: async (msg, args, embed, bot, serverQueue) => {
		if (serverQueue.isEmpty()) {
			embed.setColor(Color.RED).setDescription("There are no songs in queue")
			return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}
		const pages = createQueueEmbed(serverQueue)
		return paginate(msg, pages)
	},
}
