import { GuildQueue } from "discord-player"

import { sendEmbed } from "../../../embeds/channels.ts"
import { errorEmbed, successEmbed } from "../../../embeds/status.ts"

import type { GuildTextBasedChannel } from "discord.js"
import type { QueueMetadata, PlayerCommand, Config } from "../../../types.ts"

class PauseCommand implements PlayerCommand {
	public aliases = ["pause"]
	public name = "pause"
	public requiresPlayer = true
	public adminCommand = false
	public user = null
	public guild = null
	public msg = null

	public execute(
		serverQueue: GuildQueue<QueueMetadata>,
		channel: GuildTextBasedChannel,
		_args: string[],
		config: Config
	) {
		if (serverQueue.dispatcher!.paused) {
			const embed = errorEmbed(null, config.lang.commands.pause.already_paused)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		const embed = successEmbed(null, config.lang.commands.pause.paused)
		serverQueue.dispatcher!.pause()
		sendEmbed(channel, { embeds: [embed] }, 20000)
	}
}

export default new PauseCommand()
