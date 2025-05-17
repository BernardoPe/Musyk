import { GuildQueue, GuildQueueEvent, Track } from "discord-player"
import { logger } from "../../Utils/Logging/logger.ts"
import { GuildQueueEventHandler } from "../../types.ts"

class PlayerErrorHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.PlayerError

	public execute(queue: GuildQueue, error: Error, track: Track) {
		logger.error(`${queue.guild.name} | ${error} | ${track.cleanTitle}`)
	}
}

export default new PlayerErrorHandler()
