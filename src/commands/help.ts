import { GuildMessage, BotCommand, MusicBot } from "../types.ts"
import paginate from "../utils/embeds/paginator.ts"
import { helpEmbeds } from "../utils/embeds/help.ts"
import { createLink } from "../utils/embeds/links.ts"

class HelpCommand implements BotCommand {
	public aliases: string[] = ["help"]
	public name: string = "help"
	public adminCommand: boolean = false
	public requiresPlayer: boolean = false
	public user: string | null = null
	public guild: string | null = null
	public msg: string | null = null

	public async execute(bot: MusicBot, msg: GuildMessage) {
		const embed = helpEmbeds()
		const link = createLink()
		await paginate(msg.channel, embed, link.components)
	}
}

export default new HelpCommand()
