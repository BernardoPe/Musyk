const { GuildQueueEvent } = require("discord-player")
const {
	nowPlayingEmbed,
	createButtons,
	sendEmbed,
	updatePlayer
} = require("../../utils/embeds.js")

module.exports = {
	name: GuildQueueEvent.playerStart,
	execute: async (queue) => {
		if (Object.keys(queue.metadata).length === 2) {
			const vc = queue.metadata["voiceChannel"]
			const textChannel = queue.metadata["textChannel"]
			const embed = nowPlayingEmbed(queue)
			const buttons = createButtons()

			const data = await sendEmbed(textChannel, {
				embeds: [embed],
				components: buttons,
				fetchReply: true,
			})

			const col = data ? data.createMessageComponentCollector() : undefined
			queue.setMetadata(
				{
					"voiceChannel": vc,
					"textChannel": textChannel,
					"message": data,
					"playButtons": col,
				}
			)
		} else updatePlayer(queue)
	},
}
