import { GuildQueue } from "discord-player"
import { MusicBot, PlayerCommand, QueueMetadata } from "../types.ts"
import { GuildTextBasedChannel } from "discord.js"

class DisconnectCommand implements PlayerCommand {
	public aliases = ["dc", "disconnect", "leave"]
	public name = "disconnect"
	public requiresPlayer = true
	public adminCommand = false
	public user = null
	public guild = null
	public msg = null

	public execute(
		channel: GuildTextBasedChannel,
		args: string[],
		bot: MusicBot,
		serverQueue: GuildQueue<QueueMetadata>
	) {
		serverQueue.delete()
	}
}

export default new DisconnectCommand()
