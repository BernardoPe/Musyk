const { GuildQueueEvent } = require("discord-player")
const winston = require("../../utils/logger.js")
module.exports = {
	name: GuildQueueEvent.playerError,
	execute: (queue, error, track) => {
		winston.logger.error(
			`${queue.guild.name} | ${error} | ${track.cleanTitle}`, error.stack
		)
	},
}
