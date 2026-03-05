import { Events, ActivityType, Client } from "discord.js"
import { logger } from "../../utils/logger/logger.ts"

import type { ClientEventHandler } from "../../types.ts"

class ClientReadyHandler implements ClientEventHandler {
	public name = Events.ClientReady

	public async execute(bot: Client) {
		bot.user!.setActivity({
			name: ".help | /help",
			type: ActivityType.Listening,
		})
		logger.info("Bot is ready")
	}
}

export default new ClientReadyHandler()
