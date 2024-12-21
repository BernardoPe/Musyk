import { TextCommand, GuildMessage, MusicBot, QueueMetadata } from "../types.ts"
import { GuildQueue } from "discord-player"
import paginate from "../utils/embeds/paginator.ts"
import { helpEmbeds } from "../utils/embeds/help.ts"
import { createLink } from "../utils/embeds/links.ts"

class HelpCommand implements TextCommand {
	public aliases: string[] = ["help"]
	public name: string = "help"
	public adminCommand: boolean = false
	public requiresPlayer: boolean = false
	public user: string | null = null
	public guild: string | null = null
	public msg: string | null = null

	public execute(msg: GuildMessage, args: string[], bot: MusicBot, serverQueue: GuildQueue<QueueMetadata> | null) {
		const embed = helpEmbeds()
		const link = createLink()
		paginate(msg.channel, embed, link.components)
	}
}

export default new HelpCommand()
