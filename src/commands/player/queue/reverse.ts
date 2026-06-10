import { GuildQueue, Track } from "discord-player"

import { replyError, replySuccess } from "@/commands/validation.ts"
import { refreshPlayer } from "@/handlers/playerUi.ts"
import type { PlayerCommand, QueueMetadata, PlayerCommandContext } from "@/types.ts"

class ReverseCommand implements PlayerCommand {
	aliases = ["reverse"]
	name = "reverse"
	public readonly requiresPlayer = true as const
	adminCommand = false

	execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, config } = ctx
		if (serverQueue.isEmpty()) {
			return replyError(channel, config.lang.commands.shared.empty_queue)
		}
		if (serverQueue.tracks.size === 1) {
			return replyError(channel, config.lang.commands.reverse.only_one_song)
		}
		this.reverse(serverQueue, serverQueue.tracks.toArray())
		refreshPlayer(serverQueue, config.lang)
		replySuccess(channel, config.lang.commands.reverse.reversed)
	}

	private reverse(serverQueue: GuildQueue<QueueMetadata>, array: Track[]) {
		let r = array.length - 1
		let l = 0

		while (l < r) {
			serverQueue.node.swap(array[l], array[r])
			l++
			r--
		}

		return array
	}
}

export default new ReverseCommand()
