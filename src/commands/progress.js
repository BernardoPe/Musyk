const { progressBar, sendEmbed } = require("../utils/embeds")
const queue = require("./queue")


module.exports = {
	aliases: ["progress", "pg"],
	name: "progress",
	requiresPlayer: true,
	async execute(msg, args, embed, bot, serverQueue) {
		const progress = progressBar(serverQueue)
		embed.setDescription(progress)
		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
