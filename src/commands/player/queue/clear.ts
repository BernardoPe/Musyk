import { sendEmbed } from "@/embeds/channels.ts"
import { errorEmbed, successEmbed } from "@/embeds/status.ts"
import { updatePlayer } from "@/embeds/player/playing.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"
import { EMBED_TIMEOUT_MS } from "@/constants.ts"

class ClearCommand implements PlayerCommand {
	aliases = ["clear"]
	name = "clear"
	requiresPlayer = true
	adminCommand: boolean = false
	execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, config } = ctx
		if (serverQueue.tracks.size === 0) {
			const embed = errorEmbed(null, config.lang.commands.clear.empty_queue)
			sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
			return
		}
		serverQueue.tracks.clear()
		updatePlayer(serverQueue, config.lang)
		const embed = successEmbed(null, config.lang.commands.clear.cleared)
		sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
	}
}

export default new ClearCommand()
