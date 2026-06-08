import { GuildQueue, Track } from "discord-player"

import { sendEmbed } from "@/embeds/channels.ts"
import { errorEmbed, successEmbed } from "@/embeds/status.ts"
import { updatePlayer } from "@/embeds/player/playing.ts"
import type { PlayerCommand, QueueMetadata, PlayerCommandContext } from "@/types.ts"

class ReverseCommand implements PlayerCommand {
	aliases = ["reverse"]
	name = "reverse"
	requiresPlayer = true
	adminCommand = false
	execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, config } = ctx
		if (serverQueue.isEmpty()) {
			const embed = errorEmbed(null, config.lang.commands.shared.empty_queue)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		if (serverQueue.tracks.size === 1) {
			const embed = errorEmbed(null, "Queue has only one song")
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		this.reverse(serverQueue, serverQueue.tracks.toArray())
		updatePlayer(serverQueue, config.lang)
		const embed = successEmbed(null, "Reversed the queue")
		sendEmbed(channel, { embeds: [embed] }, 20000)
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
