import { sendEmbed } from "@/embeds/channels.ts"
import { errorEmbed, successEmbed } from "@/embeds/status.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class ResumeCommand implements PlayerCommand {
	aliases = ["resume"]
	name = "resume"
	requiresPlayer = true
	adminCommand = false
	execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, config } = ctx
		if (serverQueue.dispatcher?.isPlaying()) {
			const embed = errorEmbed(null, config.lang.commands.resume.already_playing)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		if (serverQueue.dispatcher?.isPaused()) {
			serverQueue.dispatcher.resume()
			const embed = successEmbed(null, config.lang.commands.resume.resumed)
			sendEmbed(channel, { embeds: [embed] }, 20000)
		}
	}
}

export default new ResumeCommand()
