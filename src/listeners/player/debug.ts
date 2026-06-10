import { GuildQueue, GuildQueueEvent } from "discord-player"
import { logger } from "@/utils/logger/logger.ts"
import { GuildQueueEventHandler } from "@/types.ts"

class DebugHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.Debug

	public execute(_queue: GuildQueue, message: string) {
		logger.debug(
			`-------------------------------\n\n\n${message}\n\n\n--------------------------------------\n\n\n`
		)
	}
}

export default new DebugHandler()
