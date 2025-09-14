import { GuildQueue, QueueRepeatMode } from "discord-player"
import { QueueMetadata, PlayerCommand } from "../../../types.ts"

class StopCommand implements PlayerCommand {
	public aliases = ["stop"]
	public name = "stop"
	public requiresPlayer = true
	public adminCommand = false
	public guild = null
	public msg = null
	public user = null

	execute(serverQueue: GuildQueue<QueueMetadata>) {
		if (serverQueue.repeatMode != QueueRepeatMode.OFF) serverQueue.setRepeatMode(QueueRepeatMode.OFF)
		serverQueue.node.stop()
	}
}

export default new StopCommand()
