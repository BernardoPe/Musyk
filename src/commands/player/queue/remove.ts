import { replyError, replySuccess } from "@/commands/validation.ts"
import { refreshPlayer } from "@/handlers/playerUi.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class RemoveCommand implements PlayerCommand {
	public aliases = ["remove"]
	public name = "remove"
	public readonly requiresPlayer = true as const
	public adminCommand = false
	public execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, args, config } = ctx
		const value = Number.parseInt(args[1])
		if (Number.isNaN(value)) {
			return replyError(channel, config.lang.commands.shared.value_must_be_number)
		}
		const tracks = serverQueue.tracks.toArray()
		if (value < 1 || value > tracks.length) {
			return replyError(
				channel,
				config.lang.commands.remove.invalid_index.replace("{queueLength}", tracks.length.toString())
			)
		}
		const song = serverQueue.node.remove(tracks[value - 1])
		if (!song) {
			return replyError(
				channel,
				config.lang.commands.remove.invalid_index.replace("{queueLength}", tracks.length.toString())
			)
		}
		replySuccess(channel, config.lang.commands.remove.removed.replace("{song}", `[${song.title}](${song.url})`))
		refreshPlayer(serverQueue, config.lang)
	}
}

export default new RemoveCommand()
