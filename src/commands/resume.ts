import {
	MusicBot,
	PlayerCommand,
	QueueMetadata,
} from "../types.ts"
import { GuildQueue } from "discord-player"
import { sendEmbed, errorEmbed, successEmbed } from "../utils/embeds.ts"
import { GuildTextBasedChannel } from "discord.js"

class ResumeCommand implements PlayerCommand {
	aliases = ["resume"]
	name = "resume"
	requiresPlayer = true
	adminCommand = false
	guild = null
	msg = null
	user = null

	async execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata>,
	) {
		if (
			serverQueue &&
      serverQueue.dispatcher &&
      !serverQueue.dispatcher.isPaused()
		) {
			const embed = errorEmbed(null, "The player is not paused")
			await sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		if (
			serverQueue &&
      serverQueue.dispatcher &&
      serverQueue.dispatcher.isPaused()
		) {
			serverQueue.dispatcher.resume()
			const embed = successEmbed(null, "Resumed the player")
			await sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
	}
}

export default new ResumeCommand()
