import { replyError, replySuccess } from "@/commands/validation.ts"
import { refreshPlayer } from "@/handlers/playerUi.ts"
import { prefetchNext } from "@/handlers/prefetch.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class ShuffleCommand implements PlayerCommand {
	public aliases = ["shuffle"]
	public name = "shuffle"
	public readonly requiresPlayer = true as const
	public adminCommand: boolean = false
	execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, config } = ctx
		if (serverQueue.tracks.size < 2) {
			return replyError(channel, config.lang.commands.shuffle.not_enough_songs)
		}

		serverQueue.tracks.shuffle()

		prefetchNext(serverQueue)
		refreshPlayer(serverQueue, config.lang)

		replySuccess(channel, config.lang.commands.shuffle.shuffled)
	}
}

export default new ShuffleCommand()
