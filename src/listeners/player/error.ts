import { GuildQueue, GuildQueueEvent, Track } from "discord-player"
import { logger } from "../../utils/logging/logger.ts"
import { GuildQueueEventHandler } from "../../types.ts"

class PlayerErrorHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.playerError

	public execute(queue: GuildQueue, error: Error, track: Track) {
		logger.error(
			`${queue.guild.name} | ${error} | ${track.cleanTitle}`,
			error.stack
		)
	}
}

export default new PlayerErrorHandler()
