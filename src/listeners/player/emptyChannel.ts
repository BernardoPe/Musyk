import {GuildQueueEventHandler} from "../../types.ts"
import {GuildQueue} from "discord-player"
import {GuildQueueEvent} from "discord-player"

class EmptyChannelHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.emptyChannel

	execute(queue: GuildQueue) {
		queue.delete()
	}
}

export default new EmptyChannelHandler()
