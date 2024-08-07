const { GuildQueueEvent } = require("discord-player")
const { EmbedBuilder } = require("discord.js")
const { sendEmbed, Color } = require("../../utils/embeds.js")
const { Util } = require("discord-player")

module.exports = {
	name: GuildQueueEvent.queueDelete,
	execute: async (queue) => {
		const [vc, channel, data, col] = queue.metadata

		let embed = new EmbedBuilder()

		if (vc.members.size === 0)
			embed.setDescription("Voice channel is empty, leaving...")
		else embed.setDescription("Leaving the channel...")

		while (queue.updating) await Util.wait(100)

		if (col) col.stop()
		if (data) data.delete()

		embed.setColor(Color.RED)

		sendEmbed(channel, { embeds: [embed] }, 20000)
	},
}
