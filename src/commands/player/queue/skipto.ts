import { sendEmbed } from "@/embeds/channels.ts"
import { errorEmbed } from "@/embeds/status.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class SkipToCommand implements PlayerCommand {
	public aliases = ["skipto"]
	public name = "skipto"
	public requiresPlayer = true
	public adminCommand = false
	public execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, args, config } = ctx
		const skipPos = Number.parseInt(args[1])

		if (Number.isNaN(skipPos) || skipPos < 1 || skipPos > serverQueue.tracks.size) {
			const embed = errorEmbed(null, config.lang.commands.shared.invalid_position)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		serverQueue?.node.skipTo(skipPos - 1)
	}
}

export default new SkipToCommand()
