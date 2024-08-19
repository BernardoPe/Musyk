const { sendEmbed, successEmbed, errorEmbed} = require("../utils/embeds")

module.exports = {
	aliases: ["volume"],
	name: "volume",
	requiresPlayer: true,
	execute: async (msg, args, bot, serverQueue) => {
		if (!args[1]) {
			const embed = successEmbed(undefined, `Volume is at ${serverQueue.node.volume}%`)
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		let volume = parseInt(args[1])

		if (isNaN(volume)) {
			const embed = errorEmbed(undefined, "Volume must be a number")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		if (volume > 200 || volume < 1) {
			const embed = errorEmbed(undefined, "Volume must be 1-200")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		serverQueue.node.setVolume(volume)
		const embed = successEmbed(undefined, `Volume set to ${volume}%`)
		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
