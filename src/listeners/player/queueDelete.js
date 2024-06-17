const { GuildQueueEvent } = require("discord-player")
const { EmbedBuilder } = require("discord.js")
const { sendEmbed } = require("../../utils/embeds.js")
const { Util } = require("discord-player")

module.exports = {
	name: GuildQueueEvent.queueDelete,
	execute: async (queue) => {
		const [vc, channel, data, col] = queue.metadata

		await Util.wait(200)

		let embed = new EmbedBuilder()

		if (vc.members.size === 0)
			embed.setDescription("Voice channel is empty, leaving...")
		else embed.setDescription("Leaving the channel...")

		if (col) col.stop()
		if (data) data.delete()

		embed.setColor(0xed4245)

		await sendEmbed(channel, { embeds: [embed] }, 20000)
	},
}
