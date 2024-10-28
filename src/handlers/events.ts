import { getAllFiles } from "../utils/configs.ts"
import * as path from "path"
import {
	ClientEventHandler,
	GuildQueueEventHandler,
	MusicBot,
} from "../types.ts"
import {ClientEvents} from "discord.js"

export async function addEventListeners(
	bot: MusicBot,
	folderPath: string = path.join(__dirname, "../listeners"),
) {
	const files = getAllFiles(folderPath)
	for (const file of files) {
		const eventModule = await import(file)
		const event = eventModule.default

		if (file.includes("player")) {
			addPlayerListener(bot, event as GuildQueueEventHandler)
		} else {
			addBotListener(bot, event as ClientEventHandler)
		}
	}
}

function addPlayerListener(bot: MusicBot, event: GuildQueueEventHandler) {
	bot.player.events.on(event.name, (...args: any) =>
		event.execute(...args, bot),
	)
}

function addBotListener(bot: MusicBot, event: ClientEventHandler) {
	bot.on(event.name as keyof ClientEvents, (...args: any) => event.execute(...args, bot))
}

export default addEventListeners
