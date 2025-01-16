import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { QueueMetadata, PlayerCommand } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"
import { errorEmbed, successEmbed } from "../../../utils/embeds/status.ts"
import { updatePlayer } from "../../../utils/embeds/player/playing.ts"
import langs from "../../../langs"

class ShuffleCommand implements PlayerCommand {
	public aliases = ["shuffle"]
	public name = "shuffle"
	public requiresPlayer = true
	public adminCommand: boolean = false
	public guild: string | null = null
	public msg: string | null = null
	public user: string | null = null

	execute(serverQueue: GuildQueue<QueueMetadata>, channel: GuildTextBasedChannel) {
		if (serverQueue.tracks.size < 2) {
			const embed = errorEmbed(null, langs.en.commands.shuffle.not_enough_songs)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		serverQueue.tracks.shuffle()

		updatePlayer(serverQueue)

		const embed = successEmbed(null, langs.en.commands.shuffle.shuffled)

		sendEmbed(channel, { embeds: [embed] }, 20000)
	}
}

export default new ShuffleCommand()
