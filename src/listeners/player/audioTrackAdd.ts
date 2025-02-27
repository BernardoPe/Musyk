import { GuildQueue, GuildQueueEvent, RawTrackData, Track } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "../../types.ts"
import { songQueuedEmbed } from "../../utils/embeds/player/queue.ts"
import { sendEmbed } from "../../utils/embeds/channels.ts"
import { updatePlayer } from "../../utils/embeds/player/playing.ts"
import { getLang } from "../../utils/configs/server.ts"

class AudioTrackAddHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.AudioTrackAdd

	public execute(queue: GuildQueue<QueueMetadata>, track: Track<RawTrackData>) {
		if (!queue.isPlaying()) return

		const lang = getLang(queue.guild.id)

		if (queue.isPlaying()) updatePlayer(queue, lang)

		const embed = songQueuedEmbed(track, queue, lang)

		sendEmbed(queue.metadata.textChannel!, { embeds: [embed] }, 60000)
	}
}

export default new AudioTrackAddHandler()
