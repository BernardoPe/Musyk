import { GuildQueue, GuildQueueEvent } from "discord-player"
import { logger } from "../../utils/logging/logger.ts"
import { GuildQueueEventHandler } from "../../types.ts"

class DebugHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.debug

	public execute(queue: GuildQueue, message: string) {
		const date = new Date()
		const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
		logger.debug(
			`${time} -------------------------------\n\n\n${message}\n\n\n--------------------------------------\n\n\n`
		)
	}
}

export default new DebugHandler()
