import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { MusicBot, PlayerCommand, QueueMetadata } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"
import { errorEmbed, successEmbed } from "../../../utils/embeds/status.ts"
import { updatePlayer } from "../../../utils/embeds/player/playing.ts"

class RemoveCommand implements PlayerCommand {
	public aliases = ["remove"]
	public name = "remove"
	public requiresPlayer = true
	public adminCommand: boolean = false
	public guild: string | null = null
	public msg: string | null = null
	public user: string | null = null

	public execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata>
	) {
		const value = parseInt(args[1])
		if (isNaN(value)) {
			const embed = errorEmbed(null, "Value must be a number")
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		const tracks = serverQueue.tracks.toArray()
		if (value < 1 || value > tracks.length) {
			const embed = errorEmbed(
				null,
				`Invalid number, must be 1-${tracks.length}`
			)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		const song = serverQueue.node.remove(tracks[value - 1])
		const embed = successEmbed(
			null,
			`Removed [${song!.title}](${song!.url}) from the queue`
		)
		updatePlayer(serverQueue)
		sendEmbed(channel, { embeds: [embed] }, 20000)
		return
	}
}

export default new RemoveCommand()
