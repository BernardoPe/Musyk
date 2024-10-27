import { GuildQueue, QueueRepeatMode } from "discord-player"
import { sendEmbed, successEmbed } from "../utils/embeds.ts"
import { MusicBot, PlayerCommand, QueueMetadata } from "../types.ts"
import { GuildTextBasedChannel } from "discord.js"

class CycleCommand implements PlayerCommand {
	public aliases = ["cycle"]
	public name = "cycle"
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
		let md = "none"
		let mode = undefined

		switch (args[1]) {
		case "off":
			serverQueue.setRepeatMode(QueueRepeatMode.OFF)
			mode = "Turned off loop mode."
			break
		case "track":
			serverQueue.setRepeatMode(QueueRepeatMode.TRACK)
			mode = "Repeating track activated"
			break
		case "queue":
			serverQueue.setRepeatMode(QueueRepeatMode.QUEUE)
			mode = "Looping queue enabled."
			break
		case "autoplay":
			serverQueue.setRepeatMode(QueueRepeatMode.AUTOPLAY)
			mode = "Autoplay mode activated."
			break
		default:
			if (serverQueue.repeatMode === QueueRepeatMode.AUTOPLAY) {
				md = "autoplay"
			} else if (serverQueue.repeatMode === QueueRepeatMode.QUEUE) {
				md = "queue"
			} else if (serverQueue.repeatMode === QueueRepeatMode.TRACK) {
				md = "track"
			} else if (serverQueue.repeatMode === QueueRepeatMode.OFF) {
				md = "off"
			}
		}
		const embed = mode
			? successEmbed(null, mode)
			: successEmbed(null, `Current mode: ${md}`)
		await sendEmbed(channel, { embeds: [embed] }, 20000)
	}
}

export default new CycleCommand()
