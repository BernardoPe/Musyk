module.exports = {
	aliases: ["stop"],
	name: "stop",
	requiresPlayer: true,
	execute: async (msg, args, embed, bot, serverQueue) => {
		serverQueue.node.stop()
	},
}
