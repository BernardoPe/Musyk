const { progressBar, sendEmbed, Color, successEmbed} = require("../utils/embeds")

module.exports = {
	aliases: ["progress", "pg"],
	name: "progress",
	requiresPlayer: true,
	async execute(msg, args, bot, serverQueue) {
		const progress = progressBar(serverQueue)
		const embed = successEmbed(undefined, progress, Color.GREEN)
		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
