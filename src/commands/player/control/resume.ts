import { sendEmbed } from "@/embeds/channels.ts"
import { errorEmbed, successEmbed } from "@/embeds/status.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"
import { EMBED_TIMEOUT_MS } from "@/constants.ts"

class ResumeCommand implements PlayerCommand {
	aliases = ["resume"]
	name = "resume"
	requiresPlayer = true
	adminCommand = false
	execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, config } = ctx
		if (serverQueue.dispatcher?.isPlaying()) {
			const embed = errorEmbed(null, config.lang.commands.resume.already_playing)
			sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
			return
		}

		if (serverQueue.dispatcher?.isPaused()) {
			serverQueue.dispatcher.resume()
			const embed = successEmbed(null, config.lang.commands.resume.resumed)
			sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
		}
	}
}

export default new ResumeCommand()
