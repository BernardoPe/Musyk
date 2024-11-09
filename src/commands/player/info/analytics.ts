import {
	GuildMessage,
	MusicBot,
	QueueMetadata,
	TextCommand,
} from "../../../types.ts"
import { GuildQueue } from "discord-player"
import paginate from "../../../utils/embeds/paginator.ts"
import { playerAnalyticsEmbed } from "../../../utils/embeds/analytics.ts"

class AnalyticsCommand implements TextCommand {
	public aliases = ["analytics", "stats"]
	public name = "analytics"
	public requiresPlayer = false
	public adminCommand = true
	public user = null
	public guild = null
	public msg = null

	public execute(
		msg: GuildMessage,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata> | null
	) {
		paginate(
			msg.channel,
			playerAnalyticsEmbed(bot.player.generateStatistics()),
			[]
		)
		return
	}
}

export default new AnalyticsCommand()
