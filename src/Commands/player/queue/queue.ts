import { sendEmbed } from "../../../Embeds/channels.ts"
import paginate from "../../../Embeds/paginator.ts"
import { Config, QueueMetadata } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"
import { createQueueEmbed } from "../../../Embeds/Player/queue.ts"
import { errorEmbed } from "../../../Embeds/status.ts"

class QueueCommand implements QueueCommand {
	public aliases = ["queue"]
	public name = "queue"
	public adminCommand: boolean = false
	public requiresPlayer: boolean = true
	public guild: string | null = null
	public msg: string | null = null
	public user: string | null = null

	public execute(
		serverQueue: GuildQueue<QueueMetadata>,
		channel: GuildTextBasedChannel,
		_args: string[],
		config: Config
	) {
		if (serverQueue.isEmpty()) {
			const embed = errorEmbed(null, config.lang.commands.shared.empty_queue)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		const pages = createQueueEmbed(serverQueue, config.lang)
		return paginate(channel, pages)
	}
}

export default new QueueCommand()
