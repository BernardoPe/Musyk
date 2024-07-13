const { GuildQueueEvent, Util } = require("discord-player")
const {
	nowPlayingEmbed,
	createButtons,
	sendEmbed,
	handlePlayer
} = require("../../utils/embeds.js")

module.exports = {
	name: GuildQueueEvent.playerStart,
	execute: async (queue) => {
		if (queue.metadata.length === 2) {
			let [vc, textChannel] = queue.metadata

			let embed = nowPlayingEmbed(queue)
			let buttons = createButtons()
			const data = await sendEmbed(textChannel, {
				embeds: [embed],
				components: buttons,
				fetchReply: true,
			})
			const col = data ? data.createMessageComponentCollector() : undefined
			queue.setMetadata([vc, textChannel, data, col])
			await handlePlayer(queue)
		}
	},
}
