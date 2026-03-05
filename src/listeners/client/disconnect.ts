import { Events } from "discord.js"
import { logger } from "../../utils/logger/logger.ts"

import type { ClientEventHandler } from "../../types.ts"

class ShardDisconnectHandler implements ClientEventHandler {
	public name = Events.ShardDisconnect
	public execute() {
		logger.warn("Shard disconnected")
	}
}

export default new ShardDisconnectHandler()
