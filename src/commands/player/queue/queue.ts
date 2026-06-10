import paginate from "@/embeds/paginator.ts"
import { createQueueEmbed } from "@/embeds/player/queue.ts"
import { replyError } from "@/commands/validation.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class QueueCommand implements PlayerCommand {
	public aliases = ["queue"]
	public name = "queue"
	public adminCommand: boolean = false
	public readonly requiresPlayer = true as const
	public execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, config, user } = ctx
		if (serverQueue.isEmpty()) {
			return replyError(channel, config.lang.commands.shared.empty_queue)
		}
		const pages = createQueueEmbed(serverQueue, config.lang)
		return paginate(channel, pages, [], user.id)
	}
}

export default new QueueCommand()
