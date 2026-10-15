import { GuildQueue, GuildQueueEvent } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "@/types.ts"
import { showPlayer } from "@/handlers/playerUi.ts"
import { prefetchNext } from "@/handlers/prefetch.ts"
import { serverRepository } from "@/storage/repositories/server.ts"
import { logger } from "@/utils/logger/logger.ts"

class PlayerStartHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.PlayerStart

	public async execute(queue: GuildQueue<QueueMetadata>) {
		prefetchNext(queue)
		const requestedAt = queue.metadata.playRequestedAt
		if (requestedAt !== null) {
			queue.metadata.playRequestedAt = null
			logger.info(
				`[PLAY]: time to audio=${Math.round(performance.now() - requestedAt)}ms | Guild: ${queue.guild.id}`
			)
		}
		const server = await serverRepository.getOrPut(queue.guild)
		await showPlayer(queue, server.lang)
	}
}

export default new PlayerStartHandler()
