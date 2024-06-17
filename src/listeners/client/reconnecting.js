const { Events } = require("discord.js")

module.exports = {
	name: Events.ShardReconnecting,
	execute() {
		let date = new Date()
		let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
		console.log(`Reconnecting now...(${time})`)
	},
}
