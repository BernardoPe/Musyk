import { GuildQueue, GuildQueueEvent } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "@/types.ts"
import { showPlayer } from "@/handlers/playerUi.ts"
import { serverRepository } from "@/storage/repositories/server.ts"

class PlayerStartHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.PlayerStart

	public async execute(queue: GuildQueue<QueueMetadata>) {
		const server = await serverRepository.getOrPut(queue.guild)
		await showPlayer(queue, server.lang)
	}
}

export default new PlayerStartHandler()
