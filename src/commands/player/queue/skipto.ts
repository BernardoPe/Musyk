import { sendEmbed } from "../../../embeds/channels.ts"
import { GuildQueue } from "discord-player"
import { errorEmbed } from "../../../embeds/status.ts"

import type { GuildTextBasedChannel } from "discord.js"
import type { QueueMetadata, PlayerCommand, Config } from "../../../types.ts"

class SkipToCommand implements PlayerCommand {
	public aliases = ["skipto"]
	public name = "skipto"
	public requiresPlayer = true
	public adminCommand = false
	public user = null
	public guild = null
	public msg = null

	public execute(
		serverQueue: GuildQueue<QueueMetadata>,
		channel: GuildTextBasedChannel,
		args: string[],
		config: Config
	) {
		const skipPos = parseInt(args[1])

		if (isNaN(skipPos) || skipPos < 1 || skipPos > serverQueue.tracks.size) {
			const embed = errorEmbed(null, config.lang.commands.shared.invalid_position)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		serverQueue?.node.skipTo(skipPos - 1)
	}
}

export default new SkipToCommand()
