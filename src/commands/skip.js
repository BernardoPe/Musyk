module.exports = {
	aliases: ["skip"],
	name: "skip",
	requiresPlayer: true,
	execute: async (msg, args, bot, serverQueue) => {
		return serverQueue.node.skip()
	},
}
