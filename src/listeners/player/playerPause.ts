import { GuildQueueEventHandler, QueueMetadata } from "../../types.ts"
import { GuildQueue, GuildQueueEvent } from "discord-player"
import { getOrCreateServerInfo } from "../../utils/db/server.ts"
import { updatePlayer } from "../../utils/embeds/player/playing.ts"

class PlayerPauseHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.PlayerPause

	public async execute(queue: GuildQueue<QueueMetadata>) {
		const server = await getOrCreateServerInfo(queue.guild)
		updatePlayer(queue, server.lang)
	}
}

export default new PlayerPauseHandler()