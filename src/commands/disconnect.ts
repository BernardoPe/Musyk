import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class DisconnectCommand implements PlayerCommand {
	public aliases = ["dc", "disconnect", "leave"]
	public name = "disconnect"
	public requiresPlayer = true
	public adminCommand = false
	public execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue } = ctx
		serverQueue.delete()
	}
}

export default new DisconnectCommand()
