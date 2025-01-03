import { PlayerCommand, QueueMetadata } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { errorEmbed, successEmbed } from "../../../utils/embeds/status.ts"

class ResumeCommand implements PlayerCommand {
	aliases = ["resume"]
	name = "resume"
	requiresPlayer = true
	adminCommand = false
	guild = null
	msg = null
	user = null

	execute(serverQueue: GuildQueue<QueueMetadata>) {
		const channel = serverQueue.metadata.textChannel!
		if (serverQueue.dispatcher && !serverQueue.dispatcher.isPaused()) {
			const embed = errorEmbed(null, "The player is not paused")
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		if (serverQueue.dispatcher && serverQueue.dispatcher.isPaused()) {
			serverQueue.dispatcher.resume()
			const embed = successEmbed(null, "Resumed the player")
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
	}
}

export default new ResumeCommand()
