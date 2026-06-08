import { GuildQueue, Util, GuildQueueEvent } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "@/types.ts"
import { sendEmbed } from "@/embeds/channels.ts"
import { leavingEmbed } from "@/embeds/player/queue.ts"
import { serverRepository } from "@/storage/repositories/server.ts"
import { EMBED_TIMEOUT_LONG_MS } from "@/constants.ts"

class EmptyQueueHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.EmptyQueue

	public async execute(queue: GuildQueue<QueueMetadata>) {
		const channel = queue.metadata.textChannel!
		const data = queue.metadata.playerEmbed
		const server = await serverRepository.getOrPut(queue.guild)

		while (queue.metadata.updatingPlayer) await Util.wait(5)

		if (data) {
			await data.delete()
			queue.metadata.playerEmbed = null
		}

		const embed = leavingEmbed(server.lang)

		sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_LONG_MS)
	}
}

export default new EmptyQueueHandler()
