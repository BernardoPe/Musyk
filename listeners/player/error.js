const { GuildQueueEvent } = require("discord-player")
const logger = require("../../utils/logger.js")
module.exports = {
	name: GuildQueueEvent.playerError,
	execute: (queue, error, track) => {
		logger.error(`[ERROR]: ${queue.guild.name} | ${error} | ${track.title}`)
	},
}
