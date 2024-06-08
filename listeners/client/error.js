const { Events } = require("discord.js")
const { winston } = require("../../utils/logger.js")

module.exports = {
	name: Events.Error,
	execute(err) {
		console.error(err)
		winston.logger.error(err)
	},
}
