import { sendEmbed } from "../../../Embeds/channels.ts"
import { QueueMetadata, PlayerCommand, Config } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"
import { errorEmbed, successEmbed } from "../../../Embeds/status.ts"
import { updatePlayer } from "../../../Embeds/Player/playing.ts"

class RemoveCommand implements PlayerCommand {
	public aliases = ["remove"]
	public name = "remove"
	public requiresPlayer = true
	public adminCommand: boolean = false
	public guild: string | null = null
	public msg: string | null = null
	public user: string | null = null

	public execute(
		serverQueue: GuildQueue<QueueMetadata>,
		channel: GuildTextBasedChannel,
		args: string[],
		config: Config
	) {
		const value = parseInt(args[1])
		if (isNaN(value)) {
			const embed = errorEmbed(null, config.lang.commands.shared.value_must_be_number)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		const tracks = serverQueue.tracks.toArray()
		if (value < 1 || value > tracks.length) {
			const embed = errorEmbed(
				null,
				config.lang.commands.remove.invalid_index.replace("{queueLength}", tracks.length.toString())
			)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}
		const song = serverQueue.node.remove(tracks[value - 1])
		const embed = successEmbed(
			null,
			config.lang.commands.remove.removed.replace("{song}", `[${song!.title}](${song!.url})`)
		)
		updatePlayer(serverQueue, config.lang)
		sendEmbed(channel, { embeds: [embed] }, 20000)
		return
	}
}

export default new RemoveCommand()
