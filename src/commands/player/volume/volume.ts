import { MusicBot, PlayerCommand, QueueMetadata } from "../../../types.ts"
import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"
import { errorEmbed, successEmbed } from "../../../utils/embeds/status.ts"

class VolumeCommand implements PlayerCommand {
	public aliases = ["volume"]
	public name = "volume"
	public requiresPlayer = true
	public adminCommand: boolean = false
	public guild: string | null = null
	public msg: string | null = null
	public user: string | null = null

	execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata>
	) {
		if (!args[1]) {
			const embed = successEmbed(
				null,
				`Volume is at ${serverQueue.node.volume}%`
			)
			return sendEmbed(channel, { embeds: [embed] }, 20000)
		}

		const volume = parseInt(args[1])

		if (isNaN(volume)) {
			const embed = errorEmbed(null, "Volume must be a number")
			return sendEmbed(channel, { embeds: [embed] }, 20000)
		}

		if (volume > 200 || volume < 1) {
			const embed = errorEmbed(null, "Volume must be 1-200")
			return sendEmbed(channel, { embeds: [embed] }, 20000)
		}

		serverQueue.node.setVolume(volume)
		const embed = successEmbed(null, `Volume set to ${volume}%`)
		return sendEmbed(channel, { embeds: [embed] }, 20000)
	}
}

export default new VolumeCommand()
