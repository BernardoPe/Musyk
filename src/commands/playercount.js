const { sendEmbed } = require("../utils/embeds")

module.exports = {
	aliases: ["playercount", "currentlyplaying"],
	name: "playercount",
	adminCommand: true,
	async execute(msg, args, embed, bot) {
		embed.setDescription(`Music is playing in ${bot.player.generateStatistics().queuesCount} server(s).`)
		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}