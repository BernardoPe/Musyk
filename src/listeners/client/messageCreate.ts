import { Events } from "discord.js"
import { handleMessageCommand } from "@/handlers/commands.ts"

import type { ClientEventHandler, GuildMessage, MusicBot } from "@/types.ts"

class MessageCreateHandler implements ClientEventHandler {
	public name = Events.MessageCreate

	public execute(msg: GuildMessage, bot: MusicBot) {
		if (msg.author.bot) return
		const args = msg.content.split(/ +/)
		handleMessageCommand(bot, msg, args)
	}
}

export default new MessageCreateHandler()
