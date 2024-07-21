const { sendEmbed, Color } = require("../utils/embeds")

module.exports = {
	aliases: ["volume"],
	name: "volume",
	requiresPlayer: true,
	execute: async (msg, args, embed, bot, serverQueue) => {
		if (!args[1]) {
			embed
				.setColor(Color.BLUE)
				.setDescription(`The current volume is ${serverQueue.node.volume}%`)
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		let volume = parseInt(args[1])

		if (isNaN(volume)) {
			embed.setDescription("Value must be a number")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		if (volume > 200 || volume < 1) {
			embed.setDescription("Volume must be 1-200 %")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		serverQueue.node.setVolume(volume)
		embed.setDescription(`Set volume to ${volume}%`)
			.setColor(Color.BLUE)
		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
