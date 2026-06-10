import { replyError, replySuccess } from "@/commands/validation.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class ResumeCommand implements PlayerCommand {
	aliases = ["resume"]
	name = "resume"
	public readonly requiresPlayer = true as const
	adminCommand = false
	execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, config } = ctx
		if (serverQueue.dispatcher?.isPlaying()) {
			return replyError(channel, config.lang.commands.resume.already_playing)
		}

		if (serverQueue.dispatcher?.isPaused()) {
			serverQueue.dispatcher.resume()
			replySuccess(channel, config.lang.commands.resume.resumed)
		}
	}
}

export default new ResumeCommand()
