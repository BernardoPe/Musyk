import { parseIntInRange, replyError, replySuccess } from "@/commands/validation.ts"
import { refreshPlayer } from "@/handlers/playerUi.ts"
import { prefetchNext } from "@/handlers/prefetch.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class SwapCommand implements PlayerCommand {
	public aliases = ["swap"]
	public name = "swap"
	public readonly requiresPlayer = true as const
	public adminCommand = false
	public execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, args, config } = ctx
		const swapPos1 = parseIntInRange(args[1], 1, serverQueue.tracks.size)
		const swapPos2 = parseIntInRange(args[2], 1, serverQueue.tracks.size)

		if (swapPos1 === null) {
			return replyError(channel, config.lang.commands.swap.invalid_position_1)
		}

		if (swapPos2 === null) {
			return replyError(channel, config.lang.commands.swap.invalid_position_2)
		}

		serverQueue.node.swap(swapPos1 - 1, swapPos2 - 1)
		prefetchNext(serverQueue)

		const tracks = serverQueue.tracks.toArray()
		const song1 = tracks[swapPos1 - 1]
		const song2 = tracks[swapPos2 - 1]

		replySuccess(
			channel,
			config.lang.commands.swap.swapped
				.replace("{song1}", `[${song1.cleanTitle}](${song1.url})`)
				.replace("{song2}", `[${song2.cleanTitle}](${song2.url})`)
		)

		if (swapPos1 === 1 || swapPos2 === 1) refreshPlayer(serverQueue, config.lang)
	}
}

export default new SwapCommand()
