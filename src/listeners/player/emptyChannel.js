const { GuildQueueEvent, Util } = require("discord-player")

module.exports = {
	name: GuildQueueEvent.emptyChannel,
	execute: async (queue) => {
		queue.delete()
	},
}
