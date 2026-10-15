import { replyError, replySuccess } from "@/commands/validation.ts"
import { refreshPlayer } from "@/handlers/playerUi.ts"
import { prefetchNext } from "@/handlers/prefetch.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class ClearCommand implements PlayerCommand {
	aliases = ["clear"]
	name = "clear"
	public readonly requiresPlayer = true as const
	adminCommand = false
	execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, config } = ctx
		if (serverQueue.isEmpty()) {
			return replyError(channel, config.lang.commands.clear.empty_queue)
		}
		serverQueue.tracks.clear()
		prefetchNext(serverQueue)
		refreshPlayer(serverQueue, config.lang)
		replySuccess(channel, config.lang.commands.clear.cleared)
	}
}

export default new ClearCommand()
