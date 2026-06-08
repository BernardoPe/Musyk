import { sendEmbed } from "@/embeds/channels.ts"
import { errorEmbed, successEmbed } from "@/embeds/status.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"
import { EMBED_TIMEOUT_MS, MAX_VOLUME } from "@/constants.ts"

class VolumeCommand implements PlayerCommand {
	public aliases = ["volume"]
	public name = "volume"
	public requiresPlayer = true
	public adminCommand: boolean = false
	execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, args, config } = ctx
		if (!args[1]) {
			const embed = successEmbed(
				null,
				config.lang.commands.volume.current_volume.replace("{volume}", serverQueue.node.volume.toString())
			)
			sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
			return
		}

		const volume = Number.parseInt(args[1])

		if (Number.isNaN(volume)) {
			const embed = errorEmbed(null, config.lang.commands.shared.value_must_be_number)
			sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
			return
		}

		if (volume > MAX_VOLUME || volume < 1) {
			const embed = errorEmbed(null, config.lang.commands.volume.invalid_volume)
			sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
			return
		}

		serverQueue.node.setVolume(volume)
		const embed = successEmbed(null, config.lang.commands.volume.volume_set.replace("{volume}", volume.toString()))
		sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
	}
}

export default new VolumeCommand()
