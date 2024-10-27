import {GuildQueue, GuildQueueEvent} from "discord-player"
import {updatePlayer} from "../../utils/embeds.ts"
import {GuildQueueEventHandler, QueueMetadata} from "../../types.ts"

class VolumeChangeHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.volumeChange

	public async execute(queue: GuildQueue<QueueMetadata>) {
		updatePlayer(queue)
	}
}

export default new VolumeChangeHandler()