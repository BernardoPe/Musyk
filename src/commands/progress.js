const { progressBar, sendEmbed, Color} = require("../utils/embeds")

module.exports = {
	aliases: ["progress", "pg"],
	name: "progress",
	requiresPlayer: true,
	async execute(msg, args, embed, bot, serverQueue) {
		const progress = progressBar(serverQueue)
		embed.setDescription(progress)
			.setColor(Color.BLUE)
		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
