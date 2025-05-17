import { Events } from "discord.js"
import { ClientEventHandler } from "../../types.ts"
import { logger } from "../../Utils/Logging/logger.ts"

class ShardDisconnectHandler implements ClientEventHandler {
	public name = Events.ShardDisconnect
	public execute() {
		logger.warn("Shard disconnected")
	}
}

export default new ShardDisconnectHandler()
