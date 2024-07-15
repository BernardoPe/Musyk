const { GuildQueueEvent } = require("discord-player")

const {
	updatePlayer,
	queuePlaylistEmbed,
	sendEmbed,
} = require("../../utils/embeds.js")

module.exports = {
	name: GuildQueueEvent.audioTracksAdd,
	execute: async (queue, tracks) => {
		const embed = queuePlaylistEmbed(tracks[0].playlist, queue)

		if (queue.isPlaying()) await updatePlayer(queue)

		await sendEmbed(queue.metadata[1], { embeds: [embed] }, 60000)
	},
}
