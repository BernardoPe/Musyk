import { sendEmbed } from "../../../utils/embeds/channels.ts"
import paginate from "../../../utils/embeds/paginator.ts"
import { QueueMetadata } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"
import { createQueueEmbed } from "../../../utils/embeds/player/queue.ts"
import { errorEmbed } from "../../../utils/embeds/status.ts"

class QueueCommand implements QueueCommand {
	public aliases = ["queue"]
	public name = "queue"
	public adminCommand: boolean = false
	public requiresPlayer: boolean = true
	public guild: string | null = null
	public msg: string | null = null
	public user: string | null = null

	public execute(serverQueue: GuildQueue<QueueMetadata>, channel: GuildTextBasedChannel) {
		if (serverQueue.isEmpty()) {
			const embed = errorEmbed(null, "The queue is empty")
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		const pages = createQueueEmbed(serverQueue)
		return paginate(channel, pages)
	}
}

export default new QueueCommand()
