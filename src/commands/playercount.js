const { sendEmbed } = require("../utils/embeds")

module.exports = {
	aliases: ["currentlyplaying"],
	name: "currentlyplaying",
	adminCommand: true,
	async execute(msg, args, embed, bot) {
		embed.setDescription(`Music is playing in ${bot.player.generateStatistics().queuesCount} server(s).`)
		return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}