const { Util } = require("discord-player")
const { sendEmbed } = require("../utils/embeds")

module.exports = {
	aliases: ["pause"],
	name: "pause",
	requiresPlayer: true,
	execute: async (msg, args, embed, bot, serverQueue) => {
		while (serverQueue.dispatcher.isBuffering()) {
			await Util.wait(5)
		}
		serverQueue.dispatcher.pause()
		embed.setColor(0x01ff34).setDescription("Paused current song")
		return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
