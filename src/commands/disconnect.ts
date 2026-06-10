import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class DisconnectCommand implements PlayerCommand {
	public aliases = ["dc", "disconnect", "leave"]
	public name = "disconnect"
	public readonly requiresPlayer = true as const
	public adminCommand = false
	public execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue } = ctx
		serverQueue.delete()
	}
}

export default new DisconnectCommand()
