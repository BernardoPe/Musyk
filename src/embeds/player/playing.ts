import { Colors, EmbedBuilder } from "discord.js"
import { GuildQueue, Track } from "discord-player"
import { SOURCE_EMOJIS } from "@/constants.ts"

import type { Snowflake } from "discord.js"
import type { RawTrackData } from "discord-player"
import type { Language } from "@/langs"

function getEmoji(source: string, embed?: EmbedBuilder): string {
	let emoji: Snowflake
	if (source.includes("youtube")) {
		emoji = SOURCE_EMOJIS.youtube
		embed?.setColor(Colors.Red)
	} else if (source.includes("spotify")) {
		emoji = SOURCE_EMOJIS.spotify
		embed?.setColor(Colors.Green)
	} else {
		emoji = SOURCE_EMOJIS.deezer
		embed?.setColor(Colors.Purple)
	}
	return emoji
}

function nowPlayingEmbed(queue: GuildQueue, lang: Language): EmbedBuilder {
	const embed = new EmbedBuilder()
	const emoji = getEmoji(queue.currentTrack!.source, embed)
	const song: Track<RawTrackData> = queue.currentTrack as Track<RawTrackData>
	embed
		.setTitle(queue.dispatcher?.paused ? lang.embeds.now_playing.paused_title : lang.embeds.now_playing.title)
		.setDescription(`${emoji} **[${song.cleanTitle}](${song.url})**`)
		.setThumbnail(`${song.thumbnail}`)
		.addFields(
			{
				name: lang.embeds.now_playing.fields.duration,
				value: `${song.metadata?.live ? "Live" : song.duration.padStart(5, "0")}`,
				inline: true,
			},
			{
				name: lang.embeds.now_playing.fields.requested_by,
				value: `${song.requestedBy}`,
				inline: true,
			},
			{
				name: lang.embeds.now_playing.fields.volume,
				value: `${queue.node.volume}%`,
				inline: true,
			}
		)

	if (queue.history.nextTrack) {
		embed.addFields(
			{
				name: lang.embeds.now_playing.fields.songs_in_queue,
				value: `${queue.size}`,
				inline: true,
			},
			{
				name: lang.embeds.now_playing.fields.total_queue_duration,
				value: `${queue.durationFormatted}`,
				inline: true,
			},
			{
				name: lang.embeds.now_playing.fields.next_track,
				value: `${getEmoji(queue.history.nextTrack.source)} **[${
					queue.history.nextTrack.cleanTitle
				}](${queue.history.nextTrack.url})**`,
				inline: true,
			}
		)
	}
	return embed
}

export { getEmoji, nowPlayingEmbed }
