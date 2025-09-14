import { Colors, EmbedBuilder } from "discord.js"
import { GuildQueue, Playlist, RawTrackData, Track } from "discord-player"
import { QueueMetadata } from "../../types.ts"
import { getEmoji } from "./playing.ts"
import { Language } from "../../langs"

function leavingEmbed(lang: Language): EmbedBuilder {
	return new EmbedBuilder().setDescription(lang.embeds.leaving.description).setColor(Colors.Red)
}

function createQueueEmbed(serverQueue: GuildQueue, lang: Language): EmbedBuilder[] {
	const pages: EmbedBuilder[] = []
	const tracks = serverQueue.tracks.toArray()

	let size = 0
	let page = 1

	while (size < tracks.length) {
		const embed = new EmbedBuilder()
		const curr = serverQueue.currentTrack!
		const duration = `(${curr.duration.padStart(5, "0")})`

		embed
			.setTitle(lang.embeds.queue.title.replace("{page}", page.toString()))
			.addFields({
				name: lang.embeds.queue.fields.currently_playing,
				value: `[${curr.cleanTitle}](${curr.url}) ${duration}`,
			})
			.setColor(Colors.Blue)

		for (let i = 0; i < 10 && size < tracks.length; i++) {
			const song = tracks[size]
			const duration = `(${song.duration.padStart(5, "0")})`
			embed.addFields({
				name: lang.embeds.queue.fields.position.replace("{position}", `${size + 1}`),
				value: `[${song.cleanTitle}](${song.url}) ${duration}`,
			})
			size++
		}

		embed.addFields(
			{
				name: lang.embeds.queue.fields.total_queue_duration,
				value: `${serverQueue.durationFormatted}`,
				inline: true,
			},
			{
				name: lang.embeds.queue.fields.songs_in_queue,
				value: `${serverQueue.size}`,
				inline: true,
			}
		)

		pages.push(embed)
		page++
	}

	return pages
}

function queuePlaylistEmbed(playlist: Playlist, lang: Language): EmbedBuilder {
	const type = playlist.tracks[0].source
	const embed = new EmbedBuilder()
	const emoji = getEmoji(type, embed)

	const thumbnail = playlist.thumbnail.includes("null") ? playlist.tracks[0].thumbnail : playlist.thumbnail

	embed
		.setTitle(lang.embeds.playlist_queued.title)
		.setDescription(`${emoji} **[${playlist.title}](${playlist.url})**`)
		.setThumbnail(`${thumbnail}`)
		.addFields(
			{
				name: lang.embeds.playlist_queued.fields.songs,
				value: `${playlist.tracks.length}`,
				inline: true,
			},
			{
				name: lang.embeds.playlist_queued.fields.duration,
				value: `${playlist.durationFormatted}`,
				inline: true,
			}
		)

	return embed
}

function songQueuedEmbed(song: Track<RawTrackData>, queue: GuildQueue<QueueMetadata>, lang: Language): EmbedBuilder {
	const type = song.source
	const embed = new EmbedBuilder()
	const emoji = getEmoji(type, embed)
	embed
		.setTitle(lang.embeds.song_queued.title)
		.setDescription(`${emoji} **[${song.cleanTitle}](${song.url})**`)
		.setThumbnail(`${song.thumbnail}`)
		.addFields(
			{
				name: lang.embeds.song_queued.duration,
				value: `${song.metadata!.live ? "Live" : song.duration.padStart(5, "0")}`,
				inline: true,
			},
			{
				name: lang.embeds.song_queued.position,
				value: `${queue.size}`,
				inline: true,
			},
			{
				name: lang.embeds.song_queued.requested_by,
				value: `${song.requestedBy}`,
				inline: true,
			}
		)

	return embed
}

export { createQueueEmbed, queuePlaylistEmbed, songQueuedEmbed, leavingEmbed }
