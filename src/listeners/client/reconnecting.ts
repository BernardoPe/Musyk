import { Events } from "discord.js"
import { ClientEventHandler } from "../../types.ts"
import { logger } from "../../utils/logging/logger.ts"

class ShardReconnectingHandler implements ClientEventHandler {
	public name = Events.ShardReconnecting

	public execute() {
		const date = new Date()
		const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
		logger.warn(`Shard reconnecting at ${time}`)
	}
}

export default new ShardReconnectingHandler()
