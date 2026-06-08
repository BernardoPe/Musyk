import paginate from "@/embeds/paginator.ts"
import { helpEmbeds } from "@/embeds/help.ts"
import { createLink } from "@/embeds/links.ts"

import type { BotCommand, CommandContext } from "@/types.ts"

class HelpCommand implements BotCommand {
	public aliases: string[] = ["help"]
	public name: string = "help"
	public adminCommand: boolean = false
	public requiresPlayer: boolean = false
	public async execute(ctx: CommandContext) {
		const { channel, config } = ctx
		const embed = helpEmbeds(config.lang)
		const link = createLink(config.lang)
		await paginate(channel, embed, link.components)
	}
}

export default new HelpCommand()
