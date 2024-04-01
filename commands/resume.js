const { sendEmbed } = require("../utils/embeds")

module.exports = {
	aliases: ["resume"],
	name: "resume",
	execute: async (msg, args, embed, bot) => {
		const serverQueue = bot.player.nodes.get(msg.guild.id)

		embed.setColor(0xfd0033).setDescription("There is no song playing")

		if (serverQueue && serverQueue.dispatcher.isPaused()) {
			embed.setColor(0x01ff34).setDescription("Resumed current song")

			serverQueue.dispatcher.resume()

			return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
