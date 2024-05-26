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

		let embed = songQueuedEmbed(track, queue)

		if (queue.isPlaying()) await updatePlayer(queue)

		await sendEmbed(queue.metadata[1], { embeds: [embed] }, 60000)
	},
}
