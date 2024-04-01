const { Events } = require("discord.js")
const { logger } = require("../../utils/logger.js")

module.exports = {
	name: Events.Error,
	execute(err) {
		logger.error(err)
	},
}
