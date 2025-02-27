import { GuildQueue, GuildQueueEvent } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "../../types.ts"
import { updatePlayer } from "../../utils/embeds/player/playing.ts"
import { getLang } from "../../utils/configs/server.ts"

class VolumeChangeHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.VolumeChange

	public execute(queue: GuildQueue<QueueMetadata>) {
		updatePlayer(queue, getLang(queue.guild.id))
	}
}

export default new VolumeChangeHandler()
