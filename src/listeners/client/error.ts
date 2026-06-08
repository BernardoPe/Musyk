import { Events } from "discord.js"
import { logger } from "@/utils/logger/logger.ts"

import type { ClientEventHandler } from "@/types.ts"

class ErrorEventHandler implements ClientEventHandler {
	public name = Events.Error
	public execute(err: any) {
		logger.error(`${err}`)
	}
}

export default new ErrorEventHandler()
