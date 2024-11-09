import { GuildQueue } from "discord-player"
import { QueueRepeatMode } from "discord-player"
import { MusicBot, PlayerCommand, QueueMetadata } from "../../../types.ts"
import { GuildTextBasedChannel } from "discord.js"

class StopCommand implements PlayerCommand {
	public aliases = ["stop"]
	public name = "stop"
	public requiresPlayer = true
	public adminCommand = false
	public guild = null
	public msg = null
	public user = null

	execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata>
	) {
		if (serverQueue.repeatMode != QueueRepeatMode.OFF)
			serverQueue.setRepeatMode(QueueRepeatMode.OFF)
		serverQueue.node.stop()
	}
}

export default new StopCommand()
