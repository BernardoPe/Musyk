const { GuildQueueEvent } = require("discord-player")

const {
	updatePlayer,
	songQueuedEmbed,
	sendEmbed,
} = require("../../utils/embeds.js")

module.exports = {
	name: GuildQueueEvent.audioTrackAdd,
	execute: async (queue, track) => {
		if (!queue.isPlaying()) return

		const embed = songQueuedEmbed(track, queue)

		if (queue.isPlaying()) await updatePlayer(queue)

		sendEmbed(queue.metadata.textChannel, { embeds: [embed] }, 60000)
	},
}
