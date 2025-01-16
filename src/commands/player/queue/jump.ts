import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { QueueMetadata, PlayerCommand } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"
import { errorEmbed } from "../../../utils/embeds/status.ts"
import langs from "../../../langs"

class JumpCommand implements PlayerCommand {
	public aliases = ["jump"]
	public name = "jump"
	public requiresPlayer = true
	public adminCommand = false
	public user = null
	public guild = null
	public msg = null

	public execute(serverQueue: GuildQueue<QueueMetadata>, channel: GuildTextBasedChannel, args: string[]) {
		const jumpPosition = parseInt(args[1])

		if (isNaN(jumpPosition) || jumpPosition < 1 || jumpPosition > serverQueue.tracks.size) {
			const embed = errorEmbed(null, langs.en.commands.jump.invalid_index)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		serverQueue.node.jump(jumpPosition - 1)
	}
}

export default new JumpCommand()
