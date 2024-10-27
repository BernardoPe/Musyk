import {
	updatePlayer,
	errorEmbed,
	sendEmbed,
	successEmbed,
} from "../utils/embeds.ts"
import {
	MusicBot,
	PlayerCommand,
	QueueMetadata,
} from "../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"

class ClearCommand implements PlayerCommand {
	aliases = ["clear"]
	name = "clear"
	requiresPlayer = true
	adminCommand: boolean = false
	guild = null
	msg = null
	user = null

	async execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata>,
	) {
		if (serverQueue.tracks.size === 0) {
			const embed = errorEmbed(null, "There are no songs in the queue")
			await sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		serverQueue.tracks.clear()
		updatePlayer(serverQueue)
		const embed = successEmbed(null, "Cleared the queue")
		await sendEmbed(channel, { embeds: [embed] }, 20000)
	}
}

export default new ClearCommand()
