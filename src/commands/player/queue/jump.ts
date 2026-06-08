import { sendEmbed } from "@/embeds/channels.ts"
import { errorEmbed } from "@/embeds/status.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class JumpCommand implements PlayerCommand {
	public aliases = ["jump"]
	public name = "jump"
	public requiresPlayer = true
	public adminCommand = false
	public execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, args, config } = ctx
		const jumpPosition = Number.parseInt(args[1])

		if (Number.isNaN(jumpPosition) || jumpPosition < 1 || jumpPosition > serverQueue.tracks.size) {
			const embed = errorEmbed(null, config.lang.commands.jump.invalid_index)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		serverQueue.node.jump(jumpPosition - 1)
	}
}

export default new JumpCommand()
