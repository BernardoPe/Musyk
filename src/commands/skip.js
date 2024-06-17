const { Util } = require("discord-player")
const { sendEmbed } = require("../utils/embeds")

module.exports = {
	aliases: ["skip"],
	name: "skip",
	execute: async (msg, args, embed, bot) => {
		embed.setColor(0xfd0033).setDescription("Not currently playing any songs")

		let serverQueue = bot.player.nodes.get(msg.guild.id)

		if (!serverQueue)
			return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)

		while (serverQueue.dispatcher.isBuffering()) {
			await Util.wait(5)
		}

		if (serverQueue.isPlaying()) return serverQueue.node.skip()
	},
}
