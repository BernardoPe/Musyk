import { GuildQueue, QueueRepeatMode } from "discord-player"
import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { PlayerCommand, QueueMetadata } from "../../../types.ts"
import { successEmbed } from "../../../utils/embeds/status.ts"
import { GuildTextBasedChannel } from "discord.js"
import langs from "../../../langs/index.ts"

class CycleCommand implements PlayerCommand {
	public aliases = ["cycle"]
	public name = "cycle"
	public requiresPlayer = true
	public adminCommand = false
	public user = null
	public guild = null
	public msg = null

	public execute(serverQueue: GuildQueue<QueueMetadata>, channel: GuildTextBasedChannel, args: string[]) {
		let md = "none"
		let mode = undefined

		switch (args[1]) {
		case "off":
			serverQueue.setRepeatMode(QueueRepeatMode.OFF)
			mode = langs.en.commands.cycle.loop_mode_off
			break
		case "track":
			serverQueue.setRepeatMode(QueueRepeatMode.TRACK)
			mode = langs.en.commands.cycle.repeat_mode_on
			break
		case "queue":
			serverQueue.setRepeatMode(QueueRepeatMode.QUEUE)
			mode = langs.en.commands.cycle.looping_queue_on
			break
		case "autoplay":
			serverQueue.setRepeatMode(QueueRepeatMode.AUTOPLAY)
			mode = langs.en.commands.cycle.autoplay_on
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
			: successEmbed(null, langs.en.commands.cycle.current_mode.replace("{mode}", md))
		sendEmbed(channel, { embeds: [embed] }, 20000)
	}
}

export default new CycleCommand()
