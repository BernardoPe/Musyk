import { GuildQueue } from "discord-player"
import { QueueMetadata, PlayerCommand } from "../types.ts"

class DisconnectCommand implements PlayerCommand {
	public aliases = ["dc", "disconnect", "leave"]
	public name = "disconnect"
	public requiresPlayer = true
	public adminCommand = false
	public user = null
	public guild = null
	public msg = null

	public execute(serverQueue: GuildQueue<QueueMetadata>) {
		serverQueue.delete()
	}
}

export default new DisconnectCommand()
