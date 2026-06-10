import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class SkipCommand implements PlayerCommand {
	aliases = ["skip"]
	name = "skip"
	public readonly requiresPlayer = true as const
	adminCommand = false
	execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue } = ctx
		serverQueue.node.skip()
	}
}

export default new SkipCommand()
