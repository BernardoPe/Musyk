import { replyError, replySuccess } from "@/commands/validation.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class PauseCommand implements PlayerCommand {
	public aliases = ["pause"]
	public name = "pause"
	public readonly requiresPlayer = true as const
	public adminCommand = false
	public execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, config } = ctx
		const dispatcher = serverQueue.dispatcher
		if (!dispatcher) {
			return replyError(channel, config.lang.shared.not_playing)
		}
		if (dispatcher.paused) {
			return replyError(channel, config.lang.commands.pause.already_paused)
		}
		dispatcher.pause()
		replySuccess(channel, config.lang.commands.pause.paused)
	}
}

export default new PauseCommand()
