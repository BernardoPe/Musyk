import { GuildQueue, GuildQueueEvent } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "../../types.ts"
import { updatePlayer } from "../../Embeds/Player/playing.ts"
import { getOrCreateServerInfo } from "../../Storage/server.ts"

class VolumeChangeHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.VolumeChange

	public async execute(queue: GuildQueue<QueueMetadata>) {
		const server = await getOrCreateServerInfo(queue.guild)
		updatePlayer(queue, server.lang)
	}
}

export default new VolumeChangeHandler()
