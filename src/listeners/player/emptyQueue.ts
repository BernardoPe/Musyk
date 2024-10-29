import {GuildQueue, Util} from "discord-player"
import {GuildQueueEventHandler, QueueMetadata} from "../../types.ts"

import {GuildQueueEvent} from "discord-player"
import {sendEmbed} from "../../utils/embeds/channels.ts"
import {leavingEmbed} from "../../utils/embeds/player/queue.ts"

class EmptyQueueHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.emptyQueue

	public async execute(queue: GuildQueue<QueueMetadata>) {

		const channel = queue.metadata.textChannel!
		const col = queue.metadata.collector
		const data = queue.metadata.playerEmbed

		while (queue.metadata.updatingPlayer) await Util.wait(100)

		if (col) {
			col.stop()
			queue.metadata.collector = null
		}

		if (data) {
			await data.delete()
			queue.metadata.playerEmbed = null
		}

		const embed = leavingEmbed()

		sendEmbed(channel, {embeds: [embed]}, 60000)
	}

}

export default new EmptyQueueHandler()