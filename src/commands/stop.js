module.exports = {
	aliases: ["stop"],
	name: "stop",
	requiresPlayer: true,
	execute: async (msg, args, bot, serverQueue) => {
		serverQueue.node.stop()
	},
}
