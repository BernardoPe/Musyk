const { GuildQueueEvent } = require("discord-player")
const {
	nowPlayingEmbed,
	createButtons,
	sendEmbed,
	handlePlayer,
	updatePlayer
} = require("../../utils/embeds.js")

module.exports = {
	name: GuildQueueEvent.playerStart,
	execute: async (queue) => {
		if (queue.metadata.length === 2) {
			const [vc, textChannel] = queue.metadata
			const embed = nowPlayingEmbed(queue)
			const buttons = createButtons()

			const data = await sendEmbed(textChannel, {
				embeds: [embed],
				components: buttons,
				fetchReply: true,
			})

			const col = data ? data.createMessageComponentCollector() : undefined
			queue.setMetadata([vc, textChannel, data, col])
		} else updatePlayer(queue)
	},
}
