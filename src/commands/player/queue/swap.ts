import { QueueMetadata, PlayerCommand } from "../../../types.ts"
import { GuildQueue } from "discord-player"

import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { GuildTextBasedChannel } from "discord.js"
import { errorEmbed, successEmbed } from "../../../utils/embeds/status.ts"
import { updatePlayer } from "../../../utils/embeds/player/playing.ts"
import langs from "../../../langs"

class SwapCommand implements PlayerCommand {
	public aliases = ["swap"]
	public name = "swap"
	public requiresPlayer = true
	public adminCommand = false
	public user = null
	public guild = null
	public msg = null

	public execute(serverQueue: GuildQueue<QueueMetadata>, channel: GuildTextBasedChannel, args: string[]) {
		const swapPos1 = parseInt(args[1])
		const swapPos2 = parseInt(args[2])

		if (isNaN(swapPos1) || swapPos1 < 1 || swapPos1 > serverQueue.tracks.size) {
			const embed = errorEmbed(null, langs.en.commands.swap.invalid_position_1)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		if (isNaN(swapPos2) || swapPos2 < 1 || swapPos2 > serverQueue.tracks.size) {
			const embed = errorEmbed(null, langs.en.commands.swap.invalid_position_2)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		serverQueue.node.swap(swapPos1 - 1, swapPos2 - 1)

		const tracks = serverQueue.tracks.toArray()
		const song1 = tracks[swapPos1 - 1]
		const song2 = tracks[swapPos2 - 1]

		const embed = successEmbed(
			null,
			langs.en.commands.swap.swapped
				.replace("{song1}", `[${song1.cleanTitle}](${song1.url})`)
				.replace("{song2}", `[${song2.cleanTitle}](${song2.url})`)
		)
		sendEmbed(channel, { embeds: [embed] }, 20000)

		if (swapPos1 === 1 || swapPos2 === 1) updatePlayer(serverQueue)
	}
}

export default new SwapCommand()
