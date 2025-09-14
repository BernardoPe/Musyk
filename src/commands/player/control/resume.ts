import { Config, PlayerCommand, QueueMetadata } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { sendEmbed } from "../../../embeds/channels.ts"
import { errorEmbed, successEmbed } from "../../../embeds/status.ts"
import { GuildTextBasedChannel } from "discord.js"

class ResumeCommand implements PlayerCommand {
	aliases = ["resume"]
	name = "resume"
	requiresPlayer = true
	adminCommand = false
	guild = null
	msg = null
	user = null

	execute(serverQueue: GuildQueue<QueueMetadata>, channel: GuildTextBasedChannel, args: string[], config: Config) {
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
