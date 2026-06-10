import { replyError, replySuccess } from "@/commands/validation.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"
import { MAX_VOLUME, MIN_VOLUME } from "@/constants.ts"

class VolumeCommand implements PlayerCommand {
	public aliases = ["volume"]
	public name = "volume"
	public readonly requiresPlayer = true as const
	public adminCommand = false
	execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, args, config } = ctx
		if (!args[1]) {
			return replySuccess(
				channel,
				config.lang.commands.volume.current_volume.replace("{volume}", serverQueue.node.volume.toString())
			)
		}

		const volume = Number.parseInt(args[1])

		if (Number.isNaN(volume)) {
			return replyError(channel, config.lang.commands.shared.value_must_be_number)
		}

		if (volume > MAX_VOLUME || volume < MIN_VOLUME) {
			return replyError(channel, config.lang.commands.volume.invalid_volume)
		}

		serverQueue.node.setVolume(volume)
		replySuccess(channel, config.lang.commands.volume.volume_set.replace("{volume}", volume.toString()))
	}
}

export default new VolumeCommand()
