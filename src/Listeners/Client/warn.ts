import { Events } from "discord.js"
import { logger } from "../../Utils/Logging/logger.ts"

class WarnEventHandler {
	public name = Events.Warn
	public execute(msg: string) {
		logger.warn(msg)
	}
}

export default new WarnEventHandler()
