const { GuildQueueEvent, Util } = require("discord-player")
const { sendEmbed } = require("../../utils/embeds.js")
const { leavingEmbed } = require("../../utils/embeds")

module.exports = {
	name: GuildQueueEvent.emptyQueue,
	execute: async (queue) => {
		const [vc, channel, data, col] = Object.values(queue.metadata)
		
		while (queue.updatingPlayer) await Util.wait(100)

		if (col) {
			col.stop()
			queue.metadata.playButtons = undefined
		}

		if (data) {
			data.delete()
			queue.metadata.message = undefined
		}

		const embed = leavingEmbed()

		sendEmbed(channel, { embeds: [embed] }, 60000)
	},
}
