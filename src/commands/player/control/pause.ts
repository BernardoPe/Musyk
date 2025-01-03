import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { QueueMetadata, PlayerCommand } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { errorEmbed, successEmbed } from "../../../utils/embeds/status.ts"

class PauseCommand implements PlayerCommand {
	public aliases = ["pause"]
	public name = "pause"
	public requiresPlayer = true
	public adminCommand = false
	public user = null
	public guild = null
	public msg = null

	public execute(serverQueue: GuildQueue<QueueMetadata>) {
		const channel = serverQueue.metadata.textChannel!
		if (serverQueue.dispatcher!.paused) {
			const embed = errorEmbed(null, "The player is already paused")
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		const embed = successEmbed(null, "Paused the player")
        serverQueue.dispatcher!.pause()
        sendEmbed(channel, { embeds: [embed] }, 20000)
        return
	}
}

export default new PauseCommand()
