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

		sendEmbed(queue.metadata.textChannel, { embeds: [embed] }, 60000)
	},
}
