import { GuildQueue, Track } from "discord-player"
import { QueueMetadata, PlayerCommand } from "../../../types.ts"

import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { GuildTextBasedChannel } from "discord.js"
import { errorEmbed, successEmbed } from "../../../utils/embeds/status.ts"
import { updatePlayer } from "../../../utils/embeds/player/playing.ts"
import langs from "../../../langs"

class ReverseCommand implements PlayerCommand {
	aliases = ["reverse"]
	name = "reverse"
	requiresPlayer = true
	adminCommand = false
	guild = null
	msg = null
	user = null

	execute(serverQueue: GuildQueue<QueueMetadata>, channel: GuildTextBasedChannel) {
		if (serverQueue.isEmpty()) {
			const embed = errorEmbed(null, langs.en.commands.shared.empty_queue)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		if (serverQueue.tracks.size === 1) {
			const embed = errorEmbed(null, "Queue has only one song")
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		this.reverse(serverQueue, serverQueue.tracks.toArray())
		updatePlayer(serverQueue)
		const embed = successEmbed(null, "Reversed the queue")
		sendEmbed(channel, { embeds: [embed] }, 20000)
		return
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
