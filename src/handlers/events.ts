import * as path from "path"
import { ClientEventHandler, GuildQueueEventHandler, MusicBot } from "../types.ts"
import { ClientEvents } from "discord.js"
import { getAllFiles } from "../utils/configs/json.ts"
import { logger } from "../utils/logging/logger.ts"

export async function addEventListeners(bot: MusicBot, folderPath: string = path.join(__dirname, "../listeners")) {
	const files = getAllFiles(folderPath)
	for (const file of files) {
		const eventModule = await import(file)
		const event = eventModule.default
		if (file.includes("player")) {
			addPlayerListener(bot, event as GuildQueueEventHandler)
			logger.info(`[PlayerEvent]: ${event.name} loaded`)
		} else {
			addBotListener(bot, event as ClientEventHandler)
			logger.info(`[ClientEvent]: ${event.name} loaded`)
		}
	}
}

function addPlayerListener(bot: MusicBot, event: GuildQueueEventHandler) {
	bot.player.events.on(event.name, (...args: any) => event.execute(...args, bot))
}

function addBotListener(bot: MusicBot, event: ClientEventHandler) {
	bot.on(event.name as keyof ClientEvents, (...args: any) => event.execute(...args, bot))
}

export default addEventListeners
