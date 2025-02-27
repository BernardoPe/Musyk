import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { validateTimestamp, millisecondsToTimestamp } from "../../../utils/time.ts"
import { QueueMetadata, PlayerCommand } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"
import { successEmbed } from "../../../utils/embeds/status.ts"
import { Language } from "../../../langs"

class SeekCommand implements PlayerCommand {
	public aliases = ["seek"]
	public name = "seek"
	public requiresPlayer = true
	public adminCommand = false
	public user = null
	public guild = null
	public msg = null

	public async execute(
		serverQueue: GuildQueue<QueueMetadata>,
		channel: GuildTextBasedChannel,
		args: string[],
		lang: Language
	) {
		const time = validateTimestamp(args[1], serverQueue.node.totalDuration)

		if (time === false) {
			const embed = successEmbed(null, lang.commands.seek.invalid_time_format.replace("{time}", args[1]))
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		if (time === -1) {
			const embed = successEmbed(null, lang.commands.seek.invalid_time.replace("{time}", args[1]))
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		const dur = `${serverQueue.currentTrack!.duration.padStart(5, "0")}`

		await serverQueue.node.seek(time as number)

		const timestamp = millisecondsToTimestamp(time as number)

		const embed = successEmbed(null, lang.commands.seek.seeked.replace("{time}", timestamp + "/" + dur))

		sendEmbed(channel, { embeds: [embed] }, 20000)
	}
}

export default new SeekCommand()
