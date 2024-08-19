const paginate = require("../utils/paginator.js")
const { sendEmbed, createQueueEmbed, errorEmbed} = require("../utils/embeds")

module.exports = {
	aliases: ["queue"],
	name: "queue",
	requiresPlayer: true,
	execute: async (msg, args, bot, serverQueue) => {
		if (serverQueue.isEmpty()) {
			const embed = errorEmbed(undefined, "The queue is empty")
			return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}
		const pages = createQueueEmbed(serverQueue)
		return paginate(msg, pages)
	},
}
