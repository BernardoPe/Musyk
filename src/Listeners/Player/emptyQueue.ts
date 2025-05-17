import { GuildQueue, Util } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "../../types.ts"

import { GuildQueueEvent } from "discord-player"
import { sendEmbed } from "../../Embeds/channels.ts"
import { leavingEmbed } from "../../Embeds/Player/queue.ts"
import { getOrCreateServerInfo } from "../../Storage/server.ts"

class EmptyQueueHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.EmptyQueue

	public async execute(queue: GuildQueue<QueueMetadata>) {
		const channel = queue.metadata.textChannel!
		const col = queue.metadata.collector
		const data = queue.metadata.playerEmbed
		const server = await getOrCreateServerInfo(queue.guild)

		while (queue.metadata.updatingPlayer) await Util.wait(5)

		if (col) {
			col.stop()
			queue.metadata.collector = null
		}

		if (data) {
			await data.delete()
			queue.metadata.playerEmbed = null
		}

		const embed = leavingEmbed(server.lang)

		sendEmbed(channel, { embeds: [embed] }, 60000)
	}
}

export default new EmptyQueueHandler()
