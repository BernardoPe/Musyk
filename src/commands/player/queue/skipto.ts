import { parseIntInRange, replyError } from "@/commands/validation.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class SkipToCommand implements PlayerCommand {
	public aliases = ["skipto"]
	public name = "skipto"
	public readonly requiresPlayer = true as const
	public adminCommand = false
	public execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, args, config } = ctx
		const skipPos = parseIntInRange(args[1], 1, serverQueue.tracks.size)

		if (skipPos === null) {
			return replyError(channel, config.lang.commands.shared.invalid_position)
		}

		serverQueue.node.skipTo(skipPos - 1)
	}
}

export default new SkipToCommand()
