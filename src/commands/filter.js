const { Util } = require("discord-player")
const { sendEmbed } = require("../utils/embeds")

module.exports = {
	aliases: ["filter"],
	name: "filter",
	requiresPlayer: true,
	async execute(msg, args, embed, bot, serverQueue) {

		while (serverQueue.dispatcher.isBuffering()) {
			await Util.wait(5)
		}

		let filter = args[1]

		if (!filter.includes("bassboost")) {
			filter = "bassboost_low"
		}

		if (filter === "disableall") {
			await serverQueue.filters.ffmpeg.setFilters(false)
			embed.setDescription("Disabled all filters")
			return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		if (!serverQueue.filters.ffmpeg.isValidFilter(filter)) {
			embed.setDescription("Invalid filter")
			return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		await serverQueue.filters.ffmpeg.toggle([filter])

		if (serverQueue.filters.ffmpeg.isEnabled(filter)) {
			embed.setDescription(`Enabled ${filter} filter`)
			return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		embed.setDescription(`Disabled ${filter} filter`)
		return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
