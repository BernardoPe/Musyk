import { GuildMessage, BotCommand, MusicBot } from "../types.ts"
import paginate from "../utils/embeds/paginator.ts"
import { helpEmbeds } from "../utils/embeds/help.ts"
import { createLink } from "../utils/embeds/links.ts"
import { Language } from "../langs"

class HelpCommand implements BotCommand {
	public aliases: string[] = ["help"]
	public name: string = "help"
	public adminCommand: boolean = false
	public requiresPlayer: boolean = false
	public user: string | null = null
	public guild: string | null = null
	public msg: string | null = null

	public async execute(bot: MusicBot, msg: GuildMessage, _args: string[], lang: Language) {
		const embed = helpEmbeds(lang)
		const link = createLink(lang)
		await paginate(msg.channel, embed, link.components)
	}
}

export default new HelpCommand()
