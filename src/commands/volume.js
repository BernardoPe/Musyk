const { sendEmbed } = require("../utils/embeds")

module.exports = {
	aliases: ["volume"],
	name: "volume",
	execute: async (msg, args, embed, bot) => {
		embed.setColor(0xfd0033).setDescription("There is no song playing")

		const serverQueue = bot.player.nodes.get(msg.guild.id)

		if (!serverQueue || !serverQueue.isPlaying())
			return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		else if (!args[1]) {
			embed
				.setColor(0x2a03f5)
				.setDescription(`The current volume is ${serverQueue.node.volume}%`)
			return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		let volume = parseInt(args[1])

		if (isNaN(volume)) {
			embed.setDescription("Value must be a number")
			return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		if (volume > 200 || volume < 1) {
			embed.setDescription("Volume must be 1-200 %").setColor(0x2a03f5)
			return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		serverQueue.node.setVolume(volume)
		embed.setDescription(`Set volume to ${volume}%`).setColor(0x2a03f5)
		return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
