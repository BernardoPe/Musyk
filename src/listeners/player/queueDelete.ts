import { GuildQueueEventHandler, QueueMetadata } from "../../types.ts"
import { sendEmbed, leftEmbed } from "../../utils/embeds/channels.ts"
import { GuildQueue, GuildQueueEvent } from "discord-player"
import { Util } from "discord-player"
import { getOrCreateServerInfo } from "../../utils/db/server.ts"

class QueueDeleteHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.QueueDelete

	public async execute(queue: GuildQueue<QueueMetadata>) {
		const channel = queue.metadata.textChannel
		const col = queue.metadata.collector
		const message = queue.metadata.playerEmbed
		const server = await getOrCreateServerInfo(queue.guild)

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
