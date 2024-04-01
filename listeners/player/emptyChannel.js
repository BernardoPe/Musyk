const { GuildQueueEvent, Util } = require("discord-player")

module.exports = {
	name: GuildQueueEvent.emptyChannel,
	execute: async (queue) => {
		while (!queue.dispatcher.isBuffering() && !queue.isPlaying()) {
			await Util.wait(100)
			if (queue.isEmpty()) break
		}
		queue.delete()
	},
}
