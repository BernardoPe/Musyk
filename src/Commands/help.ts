import { GuildMessage, BotCommand, MusicBot, Config } from "../types.ts"
import paginate from "../embeds/paginator.ts"
import { helpEmbeds } from "../embeds/help.ts"
import { createLink } from "../embeds/links.ts"

class HelpCommand implements BotCommand {
	public aliases: string[] = ["help"]
	public name: string = "help"
	public adminCommand: boolean = false
	public requiresPlayer: boolean = false
	public user: string | null = null
	public guild: string | null = null
	public msg: string | null = null

	public async execute(bot: MusicBot, msg: GuildMessage, _args: string[], config: Config) {
		const embed = helpEmbeds(config.lang)
		const link = createLink(config.lang)
		await paginate(msg.channel, embed, link.components)
	}
}

export default new HelpCommand()
