const { GuildQueueEvent } = require("discord-player")

module.exports = {
	name: GuildQueueEvent.emptyChannel,
	execute: async (queue) => {
		queue.delete()
	},
}
