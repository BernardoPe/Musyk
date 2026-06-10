import { parseIntInRange, replyError } from "@/commands/validation.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class JumpCommand implements PlayerCommand {
	public aliases = ["jump"]
	public name = "jump"
	public readonly requiresPlayer = true as const
	public adminCommand = false
	public execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, args, config } = ctx
		const jumpPosition = parseIntInRange(args[1], 1, serverQueue.tracks.size)

		if (jumpPosition === null) {
			return replyError(channel, config.lang.commands.jump.invalid_index)
		}

		serverQueue.node.jump(jumpPosition - 1)
	}
}

export default new JumpCommand()
