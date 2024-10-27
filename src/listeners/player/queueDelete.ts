import {GuildQueueEventHandler, QueueMetadata} from "../../types.ts"
import {sendEmbed, leftEmbed} from "../../utils/embeds.ts"
import {GuildQueue, GuildQueueEvent, Util} from "discord-player"


class QueueDeleteHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.queueDelete

	public async execute(queue: GuildQueue<QueueMetadata>) {

		const channel = queue.metadata.textChannel
		const col = queue.metadata.collector
		const message = queue.metadata.playerEmbed

		while (queue.metadata.updatingPlayer) await Util.wait(100)

		if (col) col.stop()
		if (message) await message.delete()

		const embed = leftEmbed()

		await sendEmbed(channel!, {embeds: [embed]}, 20000)
	}
}

export default new QueueDeleteHandler()