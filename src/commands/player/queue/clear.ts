import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { QueueMetadata, PlayerCommand, Config } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"
import { errorEmbed, successEmbed } from "../../../utils/embeds/status.ts"
import { updatePlayer } from "../../../utils/embeds/player/playing.ts"

class ClearCommand implements PlayerCommand {
	aliases = ["clear"]
	name = "clear"
	requiresPlayer = true
	adminCommand: boolean = false
	guild = null
	msg = null
	user = null

	execute(serverQueue: GuildQueue<QueueMetadata>, channel: GuildTextBasedChannel, _args: string[], config: Config) {
		if (serverQueue.tracks.size === 0) {
			const embed = errorEmbed(null, config.lang.commands.clear.empty_queue)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		serverQueue.tracks.clear()
		updatePlayer(serverQueue, config.lang)
		const embed = successEmbed(null, config.lang.commands.clear.cleared)
		sendEmbed(channel, { embeds: [embed] }, 20000)
	}
}

export default new ClearCommand()
