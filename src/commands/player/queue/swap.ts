import { MusicBot, PlayerCommand, QueueMetadata } from "../../../types.ts"
import { GuildQueue } from "discord-player"

import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { GuildTextBasedChannel } from "discord.js"
import { errorEmbed, successEmbed } from "../../../utils/embeds/status.ts"
import { updatePlayer } from "../../../utils/embeds/player/playing.ts"

class SwapCommand implements PlayerCommand {
	public aliases = ["swap"]
	public name = "swap"
	public requiresPlayer = true
	public adminCommand = false
	public user = null
	public guild = null
	public msg = null

	public execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata>
	) {
		const swapPos1 = parseInt(args[1])
		const swapPos2 = parseInt(args[2])

		if (
			isNaN(swapPos1) ||
            swapPos1 < 1 ||
            swapPos1 > serverQueue.tracks.size
		) {
			const embed = errorEmbed(null, "Invalid position 1 provided")
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		if (
			isNaN(swapPos2) ||
            swapPos2 < 1 ||
            swapPos2 > serverQueue.tracks.size
		) {
			const embed = errorEmbed(null, "Invalid position 2 provided")
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		serverQueue.node.swap(swapPos1 - 1, swapPos2 - 1)

		const tracks = serverQueue.tracks.toArray()
		const song1 = tracks[swapPos1 - 1]
		const song2 = tracks[swapPos2 - 1]

		const embed = successEmbed(
			null,
			`Swapped **[${song1.cleanTitle}](${song1.url})** with **[${song2.cleanTitle}](${song2.url})**`
		)
		sendEmbed(channel, { embeds: [embed] }, 20000)

		if (swapPos1 === 1 || swapPos2 === 1) updatePlayer(serverQueue)
	}
}

export default new SwapCommand()
