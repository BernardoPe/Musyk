import {GuildQueue, GuildQueueEvent, RawTrackData, Track} from "discord-player"
import {updatePlayer, songQueuedEmbed, sendEmbed} from "../../utils/embeds.ts"
import {GuildQueueEventHandler, QueueMetadata} from "../../types.ts"

class AudioTrackAddHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.audioTrackAdd

	public async execute(queue: GuildQueue<QueueMetadata>, track: Track<RawTrackData>) {
		if (!queue.isPlaying()) return

		const embed = songQueuedEmbed(track, queue)

		if (queue.isPlaying()) updatePlayer(queue)

		await sendEmbed(queue.metadata.textChannel!, {embeds: [embed]}, 60000)
	}
}

export default new AudioTrackAddHandler()