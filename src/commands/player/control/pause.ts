import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { QueueMetadata, PlayerCommand } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { errorEmbed, successEmbed } from "../../../utils/embeds/status.ts"
import langs from "../../../langs/index.ts"

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
			const embed = errorEmbed(null, langs.en.commands.pause.already_paused)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		const embed = successEmbed(null, langs.en.commands.pause.paused)
        serverQueue.dispatcher!.pause()
        sendEmbed(channel, { embeds: [embed] }, 20000)
        return
	}
}

export default new PauseCommand()
