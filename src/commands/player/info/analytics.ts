import { GuildMessage, BotCommand, MusicBot, Config } from "../../../types.ts"
import paginate from "../../../utils/embeds/paginator.ts"
import { playerAnalyticsEmbed } from "../../../utils/embeds/analytics.ts"

class AnalyticsCommand implements BotCommand {
	public aliases = ["analytics", "stats"]
	public name = "analytics"
	public requiresPlayer = false
	public adminCommand = true
	public user = null
	public guild = null
	public msg = null

	public async execute(bot: MusicBot, msg: GuildMessage, _args: string[], config: Config) {
		await paginate(msg.channel, playerAnalyticsEmbed(bot.player.generateStatistics(), config.lang), [])
	}
}

export default new AnalyticsCommand()
