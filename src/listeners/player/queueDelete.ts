import { GuildQueueEventHandler, QueueMetadata } from "@/types.ts"
import { sendEmbed } from "@/embeds/channels.ts"
import { leftEmbed } from "@/embeds/player/queue.ts"
import { GuildQueue, GuildQueueEvent, Util } from "discord-player"
import { serverRepository } from "@/storage/repositories/server.ts"
import { EMBED_TIMEOUT_MS } from "@/constants.ts"

class QueueDeleteHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.QueueDelete

	public async execute(queue: GuildQueue<QueueMetadata>) {
		const channel = queue.metadata.textChannel
		const message = queue.metadata.playerEmbed
		const server = await serverRepository.getOrPut(queue.guild)

		while (queue.metadata.updatingPlayer) await Util.wait(5)

		if (message) {
			await message.delete()
			queue.metadata.playerEmbed = null
		}

		const embed = leftEmbed(server.lang)

		sendEmbed(channel!, { embeds: [embed] }, EMBED_TIMEOUT_MS)
	}
}

export default new QueueDeleteHandler()
