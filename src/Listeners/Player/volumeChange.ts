import { GuildQueue, GuildQueueEvent } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "../../types.ts"
import { updatePlayer } from "../../embeds/player/playing.ts"
import { serverRepository } from "../../storage/repositories/server.ts"

class VolumeChangeHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.VolumeChange

	public async execute(queue: GuildQueue<QueueMetadata>) {
		const server = await serverRepository.getOrPut(queue.guild)
		updatePlayer(queue, server.lang)
	}
}

export default new VolumeChangeHandler()
