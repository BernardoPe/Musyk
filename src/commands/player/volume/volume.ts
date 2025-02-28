import { QueueMetadata, PlayerCommand, Config } from "../../../types.ts"
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

	execute(serverQueue: GuildQueue<QueueMetadata>, channel: GuildTextBasedChannel, args: string[], config: Config) {
		if (!args[1]) {
			const embed = successEmbed(
				null,
				config.lang.commands.volume.current_volume.replace("{volume}", serverQueue.node.volume.toString())
			)
			return sendEmbed(channel, { embeds: [embed] }, 20000)
		}

		const volume = parseInt(args[1])

		if (isNaN(volume)) {
			const embed = errorEmbed(null, config.lang.commands.shared.value_must_be_number)
			return sendEmbed(channel, { embeds: [embed] }, 20000)
		}

		if (volume > 200 || volume < 1) {
			const embed = errorEmbed(null, config.lang.commands.volume.invalid_volume)
			return sendEmbed(channel, { embeds: [embed] }, 20000)
		}

		serverQueue.node.setVolume(volume)
		const embed = successEmbed(null, config.lang.commands.volume.volume_set.replace("{volume}", volume.toString()))
		return sendEmbed(channel, { embeds: [embed] }, 20000)
	}
}

export default new VolumeCommand()
