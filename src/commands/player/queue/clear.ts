import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { QueueMetadata, PlayerCommand } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"
import { errorEmbed, successEmbed } from "../../../utils/embeds/status.ts"
import { updatePlayer } from "../../../utils/embeds/player/playing.ts"
import langs from "../../../langs"

class ClearCommand implements PlayerCommand {
	aliases = ["clear"]
	name = "clear"
	requiresPlayer = true
	adminCommand: boolean = false
	guild = null
	msg = null
	user = null

	execute(serverQueue: GuildQueue<QueueMetadata>, channel: GuildTextBasedChannel) {
		if (serverQueue.tracks.size === 0) {
			const embed = errorEmbed(null, langs.en.commands.clear.empty_queue)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		serverQueue.tracks.clear()
		updatePlayer(serverQueue)
		const embed = successEmbed(null, langs.en.commands.clear.cleared)
		sendEmbed(channel, { embeds: [embed] }, 20000)
	}
}

export default new ClearCommand()
