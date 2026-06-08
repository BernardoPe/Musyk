import { GuildQueue, GuildQueueEvent, Track } from "discord-player"
import { logger } from "@/utils/logger/logger.ts"
import { GuildQueueEventHandler } from "@/types.ts"

class PlayerErrorHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.Error

	public execute(queue: GuildQueue, error: Error, track: Track) {
		console.error(error)
		logger.error(`${queue.guild.name} | ${error} | ${track.cleanTitle}`)
	}
}

export default new PlayerErrorHandler()
