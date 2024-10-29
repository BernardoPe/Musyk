import {GuildQueue, GuildQueueEvent, Track} from "discord-player"
import {GuildQueueEventHandler, QueueMetadata} from "../../types.ts"
import {queuePlaylistEmbed} from "../../utils/embeds/player/queue.ts"
import {sendEmbed} from "../../utils/embeds/channels.ts"
import {updatePlayer} from "../../utils/embeds/player/playing.ts"

class AudioTracksAddHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.audioTracksAdd

	public execute(queue: GuildQueue<QueueMetadata>, tracks: Track[]) {
		const embed = queuePlaylistEmbed(tracks[0].playlist!)

		if (queue.isPlaying()) updatePlayer(queue)

		sendEmbed(queue.metadata.textChannel!, {embeds: [embed]}, 60000)
	}
}

export default new AudioTracksAddHandler()