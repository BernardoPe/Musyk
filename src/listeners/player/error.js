const { GuildQueueEvent } = require("discord-player")
const winston = require("../../utils/logger.js")
module.exports = {
	name: GuildQueueEvent.playerError,
	execute: (queue, error, track) => {
		console.log(error)
		winston.logger.error(
			`[ERROR]: ${queue.guild.name} | ${error} | ${track.cleanTitle}`,
		)
	},
}
