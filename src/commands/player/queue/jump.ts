import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { MusicBot, PlayerCommand, QueueMetadata } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"
import { errorEmbed } from "../../../utils/embeds/status.ts"

class JumpCommand implements PlayerCommand {
	public aliases = ["jump"]
	public name = "jump"
	public requiresPlayer = true
	public adminCommand = false
	public user = null
	public guild = null
	public msg = null

	public execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata>
	) {
		const jumpPosition = parseInt(args[1])

		if (isNaN(jumpPosition) || jumpPosition < 1 || jumpPosition > serverQueue.tracks.size) {
			const embed = errorEmbed(null, "Invalid position")
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		serverQueue.node.jump(jumpPosition - 1)
	}
}

export default new JumpCommand()
