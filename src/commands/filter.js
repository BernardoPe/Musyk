const { sendEmbed } = require("../utils/embeds")

module.exports = {
	aliases: ["filter"],
	name: "filter",
	requiresPlayer: true,
	async execute(msg, args, embed, bot, serverQueue) {

		let filter = args[1]

		if (!filter.includes("bassboost")) {
			filter = "bassboost_low"
		}

		if (filter === "disableall") {
			await serverQueue.filters.ffmpeg.setFilters(false)
			embed.setDescription("Disabled all filters")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		if (!serverQueue.filters.ffmpeg.isValidFilter(filter)) {
			embed.setDescription("Invalid filter")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		await serverQueue.filters.ffmpeg.toggle([filter])

		if (serverQueue.filters.ffmpeg.isEnabled(filter)) {
			embed.setDescription(`Enabled ${filter} filter`)
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		embed.setDescription(`Disabled ${filter} filter`)
		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
