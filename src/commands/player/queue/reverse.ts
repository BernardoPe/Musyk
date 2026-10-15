import { replyError, replySuccess } from "@/commands/validation.ts"
import { refreshPlayer } from "@/handlers/playerUi.ts"
import { prefetchNext } from "@/handlers/prefetch.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class ReverseCommand implements PlayerCommand {
	aliases = ["reverse"]
	name = "reverse"
	public readonly requiresPlayer = true as const
	adminCommand = false

	execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, config } = ctx
		if (serverQueue.isEmpty()) {
			return replyError(channel, config.lang.commands.shared.empty_queue)
		}
		if (serverQueue.tracks.size === 1) {
			return replyError(channel, config.lang.commands.reverse.only_one_song)
		}
		serverQueue.tracks.store.reverse()
		prefetchNext(serverQueue)
		refreshPlayer(serverQueue, config.lang)
		replySuccess(channel, config.lang.commands.reverse.reversed)
	}
}

export default new ReverseCommand()
