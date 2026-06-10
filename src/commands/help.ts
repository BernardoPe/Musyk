import paginate from "@/embeds/paginator.ts"
import { helpEmbeds } from "@/embeds/help.ts"
import { createLink } from "@/embeds/links.ts"

import type { ChatInputCommandInteraction } from "discord.js"
import type { BotCommand, CommandContext, SlashCommand, SlashCommandContext } from "@/types.ts"

class HelpCommand implements BotCommand, SlashCommand {
	public aliases: string[] = ["help"]
	public name: string = "help"
	public slashName: string = "help"
	public adminCommand: boolean = false
	public readonly requiresPlayer = false as const

	public async execute(ctx: CommandContext) {
		const { channel, config } = ctx
		const embed = helpEmbeds(config.lang)
		const link = createLink(config.lang)
		await paginate(channel, embed, link.components)
	}

	public async executeSlash(interaction: ChatInputCommandInteraction, ctx: SlashCommandContext) {
		await interaction.reply({
			embeds: helpEmbeds(ctx.config.lang),
			components: [createLink(ctx.config.lang)],
			flags: "Ephemeral",
		})
	}
}

export default new HelpCommand()
