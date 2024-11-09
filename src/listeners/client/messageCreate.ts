import { ClientEventHandler, GuildMessage, MusicBot } from "../../types.ts"
import { Events } from "discord.js"
import { handleCommand } from "../../handlers/commands.ts"

class MessageCreateHandler implements ClientEventHandler {
	public name = Events.MessageCreate

	public execute(msg: GuildMessage, bot: MusicBot) {
		if (msg.author.bot) return

		const args = msg.content.split(" ")

		handleCommand(msg, args, bot)
	}
}

export default new MessageCreateHandler()
