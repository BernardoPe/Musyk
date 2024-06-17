const { Events } = require("discord.js")

module.exports = {
	name: Events.Warn,
	execute() {
		console.warn
	},
}
