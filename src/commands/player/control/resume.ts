import { PlayerCommand, QueueMetadata } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { errorEmbed, successEmbed } from "../../../utils/embeds/status.ts"
import { Language } from "../../../langs"
import { GuildTextBasedChannel } from "discord.js"

class ResumeCommand implements PlayerCommand {
	aliases = ["resume"]
	name = "resume"
	requiresPlayer = true
	adminCommand = false
	guild = null
	msg = null
	user = null

	execute(serverQueue: GuildQueue<QueueMetadata>, channel: GuildTextBasedChannel, args: string[], lang: Language) {
		if (serverQueue.dispatcher && serverQueue.dispatcher.isPlaying()) {
			const embed = errorEmbed(null, lang.commands.resume.already_playing)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		if (serverQueue.dispatcher && serverQueue.dispatcher.isPaused()) {
			serverQueue.dispatcher.resume()
			const embed = successEmbed(null, lang.commands.resume.resumed)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
	}
}

export default new ResumeCommand()
