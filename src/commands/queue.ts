import { sendEmbed, createQueueEmbed, errorEmbed } from "../utils/embeds.ts"
import paginate from "../utils/paginator.ts"
import { MusicBot, PlayerCommand, QueueMetadata } from "../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"

class QueueCommand implements PlayerCommand {
	public aliases = ["queue"]
	public name = "queue"
	public adminCommand: boolean = false
	public requiresPlayer: boolean = true
	public guild: string | null = null
	public msg: string | null = null
	public user: string | null = null

	public async execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata>,
	) {
		if (serverQueue.isEmpty()) {
			const embed = errorEmbed(null, "The queue is empty")
			await sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		const pages = createQueueEmbed(serverQueue)
		return paginate(channel, pages)
	}
}

export default new QueueCommand()
