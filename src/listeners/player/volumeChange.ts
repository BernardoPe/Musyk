import {GuildQueue, GuildQueueEvent} from "discord-player"
import {GuildQueueEventHandler, QueueMetadata} from "../../types.ts"
import {updatePlayer} from "../../utils/embeds/player/playing.ts"

class VolumeChangeHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.volumeChange

	public execute(queue: GuildQueue<QueueMetadata>) {
		updatePlayer(queue)
	}
}

export default new VolumeChangeHandler()