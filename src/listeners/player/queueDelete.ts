import { GuildQueueEventHandler, QueueMetadata } from "../../types.ts"
import { sendEmbed, leftEmbed } from "../../embeds/channels.ts"
import { GuildQueue, GuildQueueEvent, Util } from "discord-player"
import { serverRepository } from "../../storage/repositories/server.ts"

class QueueDeleteHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.QueueDelete

	public async execute(queue: GuildQueue<QueueMetadata>) {
		const channel = queue.metadata.textChannel
		const col = queue.metadata.collector
		const message = queue.metadata.playerEmbed
		const server = await serverRepository.getOrPut(queue.guild)

		while (queue.metadata.updatingPlayer) await Util.wait(5)

		if (col) {
			col.stop()
			queue.metadata.collector = null
		}

		if (message) {
			await message.delete()
			queue.metadata.playerEmbed = null
		}

		const embed = leftEmbed(server.lang)

		sendEmbed(channel!, { embeds: [embed] }, 20000)
	}
}

export default new QueueDeleteHandler()
