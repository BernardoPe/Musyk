import { sendEmbed, successEmbed } from "../utils/embeds.ts"
import { validateTimestamp, millisecondsToTimestamp } from "../utils/time"
import {
	MusicBot,
	PlayerCommand,
	QueueMetadata,
} from "../types.ts"
import { GuildQueue } from "discord-player"
import { GuildTextBasedChannel } from "discord.js"

class SeekCommand implements PlayerCommand {
	public aliases = ["seek"]
	public name = "seek"
	public requiresPlayer = true
	public adminCommand = false
	public user = null
	public guild = null
	public msg = null

	public async execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata>,
	) {
		const time = validateTimestamp(args[1], serverQueue.node.totalDuration)

		if (time === false) {
			const embed = successEmbed(
				null,
				"**" +
          args[1] +
          "** is not a valid timestamp format, correct format should be **hh:mm:ss**.",
			)
			await sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		if (time === -1) {
			const embed = successEmbed(
				null,
				"**" +
          args[1] +
          "** is not a valid timestamp in this track, check this song's total duration.",
			)
			await sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		const dur = `${serverQueue.currentTrack!.duration.padStart(5, "0")}`
		await serverQueue.node.seek(time as number)

		const timestamp = millisecondsToTimestamp(time as number)
		const embed = successEmbed(
			null,
			"Track playback time set to **" + timestamp + "/" + dur + "**",
		)

		await sendEmbed(channel, { embeds: [embed] }, 20000)
		return
	}
}

export default new SeekCommand()
