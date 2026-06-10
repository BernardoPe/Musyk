import { QueueRepeatMode } from "discord-player"

import { replySuccess } from "@/commands/validation.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class CycleCommand implements PlayerCommand {
	public aliases = ["cycle"]
	public name = "cycle"
	public readonly requiresPlayer = true as const
	public adminCommand = false
	public execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, args, config } = ctx
		let md = "none"
		let mode = undefined

		switch (args[1]) {
			case "off":
				serverQueue.setRepeatMode(QueueRepeatMode.OFF)
				mode = config.lang.commands.cycle.loop_mode_off
				break
			case "track":
				serverQueue.setRepeatMode(QueueRepeatMode.TRACK)
				mode = config.lang.commands.cycle.repeat_mode_on
				break
			case "queue":
				serverQueue.setRepeatMode(QueueRepeatMode.QUEUE)
				mode = config.lang.commands.cycle.looping_queue_on
				break
			case "autoplay":
				serverQueue.setRepeatMode(QueueRepeatMode.AUTOPLAY)
				mode = config.lang.commands.cycle.autoplay_on
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
		replySuccess(channel, mode ?? config.lang.commands.cycle.current_mode.replace("{mode}", md))
	}
}

export default new CycleCommand()
