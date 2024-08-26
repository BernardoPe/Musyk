module.exports = {
	aliases: ["dc", "disconnect", "leave"],
	name: "disconnect",
	execute: async (msg, args, bot, serverQueue) => {
		serverQueue.delete()
	},
}
