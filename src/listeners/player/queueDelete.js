const { GuildQueueEvent } = require("discord-player")
const { sendEmbed } = require("../../utils/embeds.js")
const { Util } = require("discord-player")
const { leftEmbed } = require("../../utils/embeds")

module.exports = {
	name: GuildQueueEvent.queueDelete,
	execute: async (queue) => {
		const [vc, channel, data, col] = Object.values(queue.metadata)

		while (queue.updatingPlayer) await Util.wait(100)

		if (col) col.stop()
		if (data) data.delete()

		const embed = leftEmbed()

		sendEmbed(channel, { embeds: [embed] }, 20000)
	},
}
