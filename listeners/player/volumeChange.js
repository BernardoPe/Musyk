const { GuildQueueEvent } = require("discord-player")
const { updatePlayer } = require("../../utils/embeds.js")
module.exports = {
	name: GuildQueueEvent.volumeChange,
	execute: async (queue) => {
		updatePlayer(queue)
	},
}
