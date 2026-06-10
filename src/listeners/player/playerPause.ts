import { GuildQueueEventHandler, QueueMetadata } from "@/types.ts"
import { GuildQueue, GuildQueueEvent } from "discord-player"
import { refreshPlayer } from "@/handlers/playerUi.ts"
import { serverRepository } from "@/storage/repositories/server.ts"

class PlayerPauseHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.PlayerPause

	public async execute(queue: GuildQueue<QueueMetadata>) {
		const server = await serverRepository.getOrPut(queue.guild)
		refreshPlayer(queue, server.lang)
	}
}

export default new PlayerPauseHandler()
