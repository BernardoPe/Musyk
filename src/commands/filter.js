const { sendEmbed, successEmbed, errorEmbed} = require("../utils/embeds")

module.exports = {
	aliases: ["filter"],
	name: "filter",
	requiresPlayer: true,
	async execute(msg, args, bot, serverQueue) {

		let filter = args[1]

		if (!filter.includes("bassboost")) {
			filter = "bassboost_low"
		}

		if (filter === "disableall") {
			await serverQueue.filters.ffmpeg.setFilters(false)
			const embed = successEmbed(undefined, "Disabled all filters")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		if (!serverQueue.filters.ffmpeg.isValidFilter(filter)) {
			const embed = errorEmbed(undefined, "Invalid filter")
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		await serverQueue.filters.ffmpeg.toggle([filter])

		if (serverQueue.filters.ffmpeg.isEnabled(filter)) {
			const embed = successEmbed(undefined, `Enabled ${filter} filter`)
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		const embed = successEmbed(undefined, `Disabled ${filter} filter`)
		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}
