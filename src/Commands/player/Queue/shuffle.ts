import { sendEmbed } from "../../../Embeds/channels.ts"
import { QueueMetadata, PlayerCommand, Config } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"
import { errorEmbed, successEmbed } from "../../../Embeds/status.ts"
import { updatePlayer } from "../../../Embeds/Player/playing.ts"

class ShuffleCommand implements PlayerCommand {
	public aliases = ["shuffle"]
	public name = "shuffle"
	public requiresPlayer = true
	public adminCommand: boolean = false
	public guild: string | null = null
	public msg: string | null = null
	public user: string | null = null

	execute(serverQueue: GuildQueue<QueueMetadata>, channel: GuildTextBasedChannel, _args: string[], config: Config) {
		if (serverQueue.tracks.size < 2) {
			const embed = errorEmbed(null, config.lang.commands.shuffle.not_enough_songs)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		serverQueue.tracks.shuffle()

		updatePlayer(serverQueue, config.lang)

		const embed = successEmbed(null, config.lang.commands.shuffle.shuffled)

		sendEmbed(channel, { embeds: [embed] }, 20000)
	}
}

export default new ShuffleCommand()
