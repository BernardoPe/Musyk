import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { MusicBot, PlayerCommand, QueueMetadata } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"
import { errorEmbed, successEmbed } from "../../../utils/embeds/status.ts"
import { updatePlayer } from "../../../utils/embeds/player/playing.ts"

class ShuffleCommand implements PlayerCommand {
	public aliases = ["shuffle"]
	public name = "shuffle"
	public requiresPlayer = true
	public adminCommand: boolean = false
	public guild: string | null = null
	public msg: string | null = null
	public user: string | null = null

	execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata>
	) {
		if (serverQueue.tracks.size < 2) {
			const embed = errorEmbed(
				null,
				"There are not enough songs in the queue to shuffle"
			)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		serverQueue.tracks.shuffle()

		updatePlayer(serverQueue)

		const embed = successEmbed(null, "Shuffled the queue")

		sendEmbed(channel, { embeds: [embed] }, 20000)
		return
	}
}

export default new ShuffleCommand()
