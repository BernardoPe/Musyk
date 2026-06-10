import { replyError, replySuccess } from "@/commands/validation.ts"
import { validateTimestamp, millisecondsToTimestamp } from "@/utils/time.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class SeekCommand implements PlayerCommand {
	public aliases = ["seek"]
	public name = "seek"
	public readonly requiresPlayer = true as const
	public adminCommand = false
	public async execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, args, config } = ctx
		const currentTrack = serverQueue.currentTrack

		if (!currentTrack) {
			return replyError(channel, config.lang.shared.not_playing)
		}

		const time = validateTimestamp(args[1], serverQueue.node.totalDuration)

		if (time === false) {
			return replyError(channel, config.lang.commands.seek.invalid_time_format.replace("{time}", args[1]))
		}

		if (time === -1) {
			return replyError(channel, config.lang.commands.seek.invalid_time.replace("{time}", args[1]))
		}

		const dur = `${currentTrack.duration.padStart(5, "0")}`

		await serverQueue.node.seek(time)

		const timestamp = millisecondsToTimestamp(time)

		replySuccess(channel, config.lang.commands.seek.seeked.replace("{time}", timestamp + "/" + dur))
	}
}

export default new SeekCommand()
