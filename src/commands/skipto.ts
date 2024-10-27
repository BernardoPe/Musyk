import { sendEmbed, errorEmbed } from "../utils/embeds.ts"
import { MusicBot, PlayerCommand, QueueMetadata } from "../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"

class SkipToCommand implements PlayerCommand {
	public aliases = ["skipto"]
	public name = "skipto"
	public requiresPlayer = true
	public adminCommand = false
	public user = null
	public guild = null
	public msg = null

	public async execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata>,
	) {
		const skipPos = parseInt(args[1])

		if (isNaN(skipPos) || skipPos < 1 || skipPos > serverQueue!.tracks.size) {
			const embed = errorEmbed(null, "Invalid position")
			await sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

    serverQueue!.node.skipTo(skipPos - 1)
	}
}

export default new SkipToCommand()
