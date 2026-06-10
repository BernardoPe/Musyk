import { GuildQueue, GuildQueueEvent } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "@/types.ts"
import { sendEmbed } from "@/embeds/channels.ts"
import { leavingEmbed } from "@/embeds/player/queue.ts"
import { serverRepository } from "@/storage/repositories/server.ts"
import { EMBED_TIMEOUT_LONG_MS } from "@/constants.ts"
import { destroyPlayer } from "@/handlers/playerUi.ts"

class EmptyQueueHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.EmptyQueue

	public async execute(queue: GuildQueue<QueueMetadata>) {
		const channel = queue.metadata.textChannel!
		const server = await serverRepository.getOrPut(queue.guild)

		await destroyPlayer(queue)

		const embed = leavingEmbed(server.lang)

		void sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_LONG_MS)
	}
}

export default new EmptyQueueHandler()
