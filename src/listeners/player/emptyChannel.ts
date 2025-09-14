import { GuildQueueEventHandler } from "../../types.ts"
import { GuildQueue, GuildQueueEvent } from "discord-player"

class EmptyChannelHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.EmptyChannel

	execute(queue: GuildQueue) {
		queue.delete()
	}
}

export default new EmptyChannelHandler()
