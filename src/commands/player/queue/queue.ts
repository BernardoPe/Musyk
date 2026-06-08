import { sendEmbed } from "@/embeds/channels.ts"
import paginate from "@/embeds/paginator.ts"
import { createQueueEmbed } from "@/embeds/player/queue.ts"
import { errorEmbed } from "@/embeds/status.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"
import { EMBED_TIMEOUT_MS } from "@/constants.ts"

class QueueCommand implements PlayerCommand {
	public aliases = ["queue"]
	public name = "queue"
	public adminCommand: boolean = false
	public requiresPlayer: boolean = true
	public execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, config } = ctx
		if (serverQueue.isEmpty()) {
			const embed = errorEmbed(null, config.lang.commands.shared.empty_queue)
			sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
			return
		}
		const pages = createQueueEmbed(serverQueue, config.lang)
		return paginate(channel, pages)
	}
}

export default new QueueCommand()
