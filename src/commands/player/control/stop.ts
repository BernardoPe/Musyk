import { QueueRepeatMode } from "discord-player"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class StopCommand implements PlayerCommand {
	public aliases = ["stop"]
	public name = "stop"
	public readonly requiresPlayer = true as const
	public adminCommand = false
	execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue } = ctx
		if (serverQueue.repeatMode != QueueRepeatMode.OFF) serverQueue.setRepeatMode(QueueRepeatMode.OFF)
		serverQueue.node.stop()
	}
}

export default new StopCommand()
