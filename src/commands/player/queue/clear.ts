import {
	sendEmbed,
} from "../../../utils/embeds/channels.ts"
import {
	MusicBot,
	PlayerCommand,
	QueueMetadata,
} from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"
import {errorEmbed, successEmbed} from "../../../utils/embeds/status.ts"
import {updatePlayer} from "../../../utils/embeds/player/playing.ts"

class ClearCommand implements PlayerCommand {
	aliases = ["clear"]
	name = "clear"
	requiresPlayer = true
	adminCommand: boolean = false
	guild = null
	msg = null
	user = null

	execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata>,
	) {
		if (serverQueue.tracks.size === 0) {
			const embed = errorEmbed(null, "There are no songs in the queue")
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		serverQueue.tracks.clear()
		updatePlayer(serverQueue)
		const embed = successEmbed(null, "Cleared the queue")
		sendEmbed(channel, { embeds: [embed] }, 20000)
	}
}

export default new ClearCommand()
