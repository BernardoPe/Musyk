const { QueueRepeatMode } = require("discord-player")

module.exports = {
	aliases: ["stop"],
	name: "stop",
	requiresPlayer: true,
	execute: async (msg, args, bot, serverQueue) => {
		if (serverQueue.repeatMode != QueueRepeatMode.OFF) 
			await serverQueue.setRepeatMode(QueueRepeatMode.OFF)
		serverQueue.node.stop()
	},
}
