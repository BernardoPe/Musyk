const { GuildQueueEvent, Util } = require("discord-player")
const { EmbedBuilder } = require("discord.js")
const { sendEmbed } = require("../../utils/embeds.js")

module.exports = {
	name: GuildQueueEvent.emptyQueue,
	execute: async (queue) => {
		const [vc, channel, data, col] = queue.metadata
		
		while (queue.updating) await Util.wait(100)

		if (col) {
			col.stop()
			queue.metadata[3] = undefined
		}

		if (data) {
			data.delete()
			queue.metadata[2] = undefined
		}

		const embed = new EmbedBuilder()
			.setDescription("Queue is empty, leaving in 5 minutes...")
			.setColor(0xed4245)

		sendEmbed(channel, { embeds: [embed] }, 60000)
	},
}
