import paginate from "@/embeds/paginator.ts"
import { playerAnalyticsEmbed } from "@/embeds/analytics.ts"

import type { BotCommand, CommandContext } from "@/types.ts"

class AnalyticsCommand implements BotCommand {
	public aliases = ["analytics", "stats"]
	public name = "analytics"
	public requiresPlayer = false
	public adminCommand = true
	public async execute(ctx: CommandContext) {
		const { bot, channel, config } = ctx
		await paginate(channel, playerAnalyticsEmbed(bot.player.generateStatistics(), config.lang), [])
	}
}

export default new AnalyticsCommand()
