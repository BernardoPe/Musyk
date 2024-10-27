import {Events} from "discord.js"
import {logger} from "../../utils/logger.ts"

class WarnEventHandler {
	public name = Events.Warn
	public execute(msg: string) {
		logger.warn(msg)
	}
}

export default new WarnEventHandler()