import { GuildQueueEventHandler, QueueMetadata } from "@/types.ts"
import { sendEmbed } from "@/embeds/channels.ts"
import { leftEmbed } from "@/embeds/player/queue.ts"
import { GuildQueue, GuildQueueEvent } from "discord-player"
import { serverRepository } from "@/storage/repositories/server.ts"
import { EMBED_TIMEOUT_MS } from "@/constants.ts"
import { destroyPlayer } from "@/handlers/playerUi.ts"
import { discardPrefetch } from "@/handlers/prefetch.ts"

class QueueDeleteHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.QueueDelete

	public async execute(queue: GuildQueue<QueueMetadata>) {
		discardPrefetch(queue)
		const channel = queue.metadata.textChannel
		const server = await serverRepository.getOrPut(queue.guild)

		await destroyPlayer(queue)

		const embed = leftEmbed(server.lang)

		void sendEmbed(channel!, { embeds: [embed] }, EMBED_TIMEOUT_MS)
	}
}

export default new QueueDeleteHandler()
