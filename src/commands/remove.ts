import {
	sendEmbed,
	updatePlayer,
	errorEmbed,
	successEmbed,
} from "../utils/embeds.ts"
import {
	MusicBot,
	PlayerCommand,
	QueueMetadata,
} from "../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"

class RemoveCommand implements PlayerCommand {
	public aliases = ["remove"]
	public name = "remove"
	public requiresPlayer = true
	public adminCommand: boolean = false
	public guild: string | null = null
	public msg: string | null = null
	public user: string | null = null

	public async execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata>,
	) {
		const value = parseInt(args[1])
		if (isNaN(value)) {
			const embed = errorEmbed(null, "Value must be a number")
			await sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		const tracks = serverQueue.tracks.toArray()
		if (value < 1 || value > tracks.length) {
			const embed = errorEmbed(
				null,
				`Invalid number, must be 1-${tracks.length}`,
			)
			await sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		const song = serverQueue.node.remove(tracks[value - 1])
		const embed = successEmbed(
			null,
			`Removed [${song!.title}](${song!.url}) from the queue`,
		)
		updatePlayer(serverQueue)
		await sendEmbed(channel, { embeds: [embed] }, 20000)
		return
	}
}

export default new RemoveCommand()
