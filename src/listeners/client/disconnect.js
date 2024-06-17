const { Events } = require("discord.js")

module.exports = {
	name: Events.ShardDisconnect,
	execute() {
		console.log("Bot disconnected, reconnecting...")
	},
}
