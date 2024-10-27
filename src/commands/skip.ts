import { MusicBot, PlayerCommand, QueueMetadata } from "../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"

class SkipCommand implements PlayerCommand {
	aliases = ["skip"]
	name = "skip"
	requiresPlayer = true
	adminCommand = false
	user = null
	guild = null
	msg = null

	async execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata>,
	) {
		serverQueue.node.skip()
		return
	}
}

export default new SkipCommand()
