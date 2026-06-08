import { sendEmbed } from "@/embeds/channels.ts"
import { errorEmbed, successEmbed } from "@/embeds/status.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class PauseCommand implements PlayerCommand {
	public aliases = ["pause"]
	public name = "pause"
	public requiresPlayer = true
	public adminCommand = false
	public execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, config } = ctx
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
