import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Collection,
	Colors,
	EmbedBuilder,
	GuildMember,
	GuildTextBasedChannel,
	Snowflake,
} from "discord.js"
import { GuildQueue, Playlist, RawTrackData, Track } from "discord-player"
import { logger } from "./logger.ts"
import { QueueMetadata } from "../types.ts"

const botID: string = process.env.BOT_ID!
const inviteLink: string = process.env.INVITE_LINK!

function createLink(): ActionRowBuilder<ButtonBuilder> {
	const link = new ButtonBuilder()
		.setLabel("Invite Link")
		.setURL(inviteLink)
		.setStyle(ButtonStyle.Link)
	return new ActionRowBuilder<ButtonBuilder>().addComponents(link)
}

function successEmbed(
	title: string | null,
	description: string | null,
): EmbedBuilder {
	return new EmbedBuilder()
		.setTitle(title)
		.setDescription(description)
		.setColor(Colors.Green)
}

function errorEmbed(
	title: string | null,
	description: string | null,
): EmbedBuilder {
	return new EmbedBuilder()
		.setTitle(title)
		.setDescription(description)
		.setColor(Colors.Red)
}

function helpEmbeds(): EmbedBuilder[] {
	const embed1 = new EmbedBuilder()
		.setAuthor({
			name: "Syken",
			url: "https://discord.com/users/259810801219534849",
			iconURL:
        "https://cdn.discordapp.com/avatars/259810801219534849/9a98973995330392dd7ed83feac84106.webp",
		})
		.setTitle("Musyk - A Music Bot")
		.setDescription(
			"Musyk is a Discord bot that allows you to play music on your server.\n\n" +
        " With Musyk, you can play music from Youtube, Spotify, and SoundCloud.",
		)
		.setColor(Colors.Blue)

	const embed2 = new EmbedBuilder()
		.setTitle("Playing Music")
		.setDescription(
			"To play music, use the command '.play <song name / url>'. Musyk will join your voice channel and start playing the requested song.\n\n" +
        "Musyk will automatically search for the requested song on Youtube if no URL is provided. If you want to search on a specific platform, use the following parameters:\n\n" +
        "**-yt** : Search on Youtube\n" +
        "**-sp** : Search on Spotify\n" +
        "**-sc** : Search on SoundCloud\n\n" +
        "For instance, '.play -yt Never Gonna Give You Up ' will search for 'Never Gonna Give You Up' on Youtube.",
		)
		.setColor(Colors.Blue)

	const embed3 = new EmbedBuilder()
		.setTitle("Command List")
		.setDescription(
			"Musyk commands start with the default prefix '.'. This prefix can be changed with the slash command '/prefix'. Available commands are listed below.\n\n" +
        "**/prefix <new prefix> ** : Set a new command prefix for this server. If 'current' or 'curr' is provided this command will display the current prefix. \n\n" +
        "**.play/.p <song name / url>** : Play a song/playlist or add it to the music queue.\n\n" +
        "**.stop**: Stop the current playback and clear the music queue.\n\n" +
        "**.clear**: Clear the music queue.\n\n" +
        "**.disconnect/.leave/.dc**: Disconnect the bot from the voice channel.\n\n" +
        "**.skip**: Skip the currently playing song and play the next song in the queue.\n\n" +
        "**.swap <Queue Position 1> <Queue Position 2>**: Swap the position of two songs in the queue.\n\n" +
        "**.progress**: Show the progress bar of the current song.\n\n" +
        "**.pause**: Pause the current playback.\n\n" +
        "**.resume**: Resume the paused playback.\n\n" +
        "**.queue**: Shows the current song queue.\n\n" +
        "**.seek <timestamp>**: skip or rewind to a timestamp in the song. Format is hh:mm:ss, (zero values before first non-zero value can be omitted)\n\n" +
        "**.volume <volume>**: Adjust the volume of the playback. If no arguments are provided shows current volume \n\n" +
        "**.remove <Queue Position>**: Remove a specific song from the music queue.\n\n" +
        "**.shuffle**: Shuffle the order of songs in the music queue.\n\n" +
        "**.skipto <Queue Position>**: Skip to a specific song in the music queue. Removes all the songs between the current one and the specified one from the queue.\n\n" +
        "**.reverse**: Reverses the queue priority.\n\n" +
        "**.jump <Queue Position>**: Jump to a specific position in the queue. Keeps all the songs between the current one and the specified one from the queue.\n\n" +
        "**.cycle <mode>**: Toggle the repeat mode for the music queue. Available options are 'off' for no repetition, 'track' for current track repetition, 'queue' for queue cycling, and 'autoplay for auto-search after the queue ends.",
		)
		.setColor(Colors.Blue)

	const embed4 = new EmbedBuilder()
		.setTitle("Play Buttons")
		.addFields(
			{ name: "⏭️", value: "Skips the current song" },
			{ name: "⏯️", value: "Pauses/Resumes the player" },
			{ name: "⏹️", value: "Stops playback and clears the music queue" },
			{ name: "🔊", value: "Increases volume by 20%" },
			{ name: "🔉", value: "Decreases volume by 20%" },
			{ name: "🔀", value: "Shuffles the current queue" },
			{ name: "🔃", value: "Reverses the current queue" },
			{ name: "🕒", value: "Shows the current queue" },
			{ name: "🔄", value: "Toggles current track cycling" },
			{ name: "🤖", value: "Toggles autoplay" },
			{ name: "🗑️", value: "Clears the queue" },
			{ name: "🔌", value: "Disconnects the bot from the voice channel" },
		)
		.setColor(Colors.Blue)

	const embed5 = new EmbedBuilder()
		.setTitle("Play Filters")
		.setDescription(
			"Through the **.filter <filter>** command, you can set filters for the audio player.\n\n" +
        "Available filters are: bassboost, 8D, vaporwave, nightcore, phaser, tremolo," +
        "vibrato, reverse, treble, normalizer, normalizer2, surrounding, pulsator, subboost, " +
        "karaoke, flanger, gate, hass, mcompand, mono, mstlr, mstrr, compress, expander, " +
        "softlimiter, chorus, chorus2d, chorus3d, fadein, dim, and lofi.\n\n" +
        "If you pass 'disableall' as the argument, all filters will be disabled.",
		)
		.setColor(0x58b9ff)

	const embed6 = new EmbedBuilder()
		.setTitle("Aditional Information")
		.setDescription(
			"Make sure Musyk has the necessary permissions to join voice channels and manage music playback.\n\n" +
        "If you find any bugs, you can open an issue in my [GitHub repository](https://github.com/BernardoPe/Musyk).",
		)
		.setColor(Colors.Blue)

	return [embed1, embed2, embed3, embed4, embed5, embed6]
}

function createButtons(): ActionRowBuilder<ButtonBuilder>[] {
	const commands: { [key: string]: string } = {
		skip: "⏭️",
		pause: "⏯️",
		stop: "⏹️",
		increaseVolume: "🔊",
		decreaseVolume: "🔉",
		shuffle: "🔀",
		reverse: "🔃",
		queue: "🕒",
		cycle: "🔄",
		autoplay: "🤖",
		clear: "🗑️",
		disconnect: "🔌",
	}

	const commandNames = Object.keys(commands)

	const rows: Array<ActionRowBuilder<ButtonBuilder>> = new Array(
		Math.ceil(commandNames.length / 5),
	)

	for (let i = 0; i < rows.length; i++) {
		rows[i] = new ActionRowBuilder()
	}

	for (let i = 0; i < commandNames.length; i++) {
		const button = new ButtonBuilder()
			.setCustomId(commandNames[i])
			.setEmoji(commands[commandNames[i]])
			.setStyle(ButtonStyle.Secondary)

		rows[Math.floor(i / 5)].addComponents(button)
	}

	return rows
}

function getEmoji(source: string, embed: EmbedBuilder): string {
	let emoji: Snowflake
	if (source.includes("youtube")) {
		emoji = "<:YouTube1:1124140924876902411>"
		if (embed) embed.setColor(Colors.Red)
	} else if (source.includes("spotify")) {
		emoji = "<:SpotifyLogo:1124141017260634262>"
		if (embed) embed.setColor(Colors.Green)
	} else {
		emoji = "<:4678_SoundCloud:1124303937017745469>"
		if (embed) embed.setColor(Colors.Orange)
	}
	return emoji
}

function createQueueEmbed(serverQueue: GuildQueue): EmbedBuilder[] {
	const pages: EmbedBuilder[] = []
	const tracks = serverQueue.tracks.toArray()

	let size = 0
	let page = 1

	while (size < tracks.length) {
		const embed = new EmbedBuilder()
		const curr = serverQueue.currentTrack!
		const duration = `(${curr.duration.padStart(5, "0")})`

		embed
			.setTitle(`Current Queue Page ${page}`)
			.addFields({
				name: "Currently playing",
				value: `[${curr.cleanTitle}](${curr.url}) ${duration}`,
			})
			.setDescription(null)
			.setColor(Colors.Blue)

		for (let i = 0; i < 10 && size < tracks.length; i++) {
			const song = tracks[size]
			const duration = `(${song.duration.padStart(5, "0")})`
			embed.addFields({
				name: `Position ${size + 1}:`,
				value: `[${song.cleanTitle}](${song.url}) ${duration}`,
			})
			size++
		}

		embed.addFields(
			{
				name: "Total Queue Duration",
				value: `${serverQueue.durationFormatted}`,
				inline: true,
			},
			{ name: "Songs in Queue", value: `${serverQueue.size}`, inline: true },
		)

		pages.push(embed)
		page++
	}

	return pages
}

function queuePlaylistEmbed(playlist: Playlist): EmbedBuilder {
	const type = playlist.tracks[0].source
	const embed = new EmbedBuilder()
	const emoji = getEmoji(type, embed)

	const thumbnail = playlist.thumbnail.includes("null")
		? playlist.tracks[0].thumbnail
		: playlist.thumbnail

	embed
		.setTitle("Playlist Queued")
		.setDescription(`${emoji} **[${playlist.title}](${playlist.url})**`)
		.setThumbnail(`${thumbnail}`)
		.addFields(
			{ name: "Songs", value: `${playlist.tracks.length}`, inline: true },
			{
				name: "Duration",
				value: `${playlist.durationFormatted}`,
				inline: true,
			},
		)

	return embed
}

function nowPlayingEmbed(queue: GuildQueue): EmbedBuilder {
	const embed = new EmbedBuilder()
	const emoji = getEmoji(queue.currentTrack!.source, embed)
	const song: Track<RawTrackData> = queue.currentTrack as Track<RawTrackData>

	embed
		.setTitle("Now Playing")
		.setDescription(`${emoji} **[${song.cleanTitle}](${song.url})**`)
		.setThumbnail(`${song.thumbnail}`)
		.addFields(
			{
				name: "Duration",
				value: `${song.metadata!.live ? "Live" : song.duration.padStart(5, "0")}`,
				inline: true,
			},
			{ name: "Requested By", value: `${song.requestedBy}`, inline: true },
			{ name: "Volume", value: `${queue.node.volume}%`, inline: true },
		)

	if (queue.history.nextTrack) {
		embed.addFields(
			{ name: "Songs in queue", value: `${queue.size}`, inline: true },
			{
				name: "Total queue duration",
				value: `${queue.durationFormatted}`,
				inline: true,
			},
			{
				name: "Next Track",
				value: `${getEmoji(queue.history.nextTrack.source, embed)} **[${
					queue.history.nextTrack.cleanTitle
				}](${queue.history.nextTrack.url})**`,
				inline: true,
			},
		)
	}
	return embed
}

function songQueuedEmbed(
	song: Track<RawTrackData>,
	queue: GuildQueue<QueueMetadata>,
): EmbedBuilder {
	const type = song.source
	const embed = new EmbedBuilder()
	const emoji = getEmoji(type, embed)
	embed
		.setTitle("Song Queued")
		.setDescription(`${emoji} **[${song.cleanTitle}](${song.url})**`)
		.setThumbnail(`${song.thumbnail}`)
		.addFields(
			{
				name: "Duration",
				value: `${song.metadata!.live ? "Live" : song.duration.padStart(5, "0")}`,
				inline: true,
			},
			{
				name: "Queue Position",
				value: `${queue.size}`,
				inline: true,
			},
			{
				name: "Requested By",
				value: `${song.requestedBy}`,
				inline: true,
			},
		)

	return embed
}

function updatePlayer(queue: GuildQueue<QueueMetadata>) {
	const embed = nowPlayingEmbed(queue)

	if (
		!queue.metadata.playerEmbed ||
    queue.metadata.updatingPlayer ||
    !queue.metadata.playerEmbed.editable
	) {
		return
	}

	queue.metadata.updatingPlayer = true // Prevents unnecessary concurrent updates

	const data = queue.metadata.playerEmbed

	data
		.edit({
			embeds: [embed],
		})
		.then(() => {
			queue.metadata.updatingPlayer = false
		})
}

function leavingEmbed(): EmbedBuilder {
	return new EmbedBuilder()
		.setDescription("Queue is empty, leaving in 5 minutes...")
		.setColor(Colors.Red)
}

function leftEmbed(): EmbedBuilder {
	return new EmbedBuilder()
		.setDescription("Leaving the channel...")
		.setColor(Colors.Red)
}

async function sendEmbed(
	channel: GuildTextBasedChannel,
	info: any,
	timeout: number | null = null,
) {
	if (!channel) {
		logger.error("Channel not found")
		return
	}

	const members: Collection<Snowflake, GuildMember> =
    channel.members as Collection<Snowflake, GuildMember>
	const bot = members.get(botID)

	if (!bot) {
		logger.error("Bot not found in the channel")
		return
	}

	if (!channel.permissionsFor(bot).has("SendMessages")) {
		logger.error("Bot doesn't have permission to send messages")
		return
	}

	const message = await channel.send(info)

	if (timeout) {
		setTimeout(() => {
			message.delete()
		}, timeout)
	}

	return message
}

export {
	sendEmbed,
	updatePlayer,
	createButtons,
	queuePlaylistEmbed,
	nowPlayingEmbed,
	songQueuedEmbed,
	helpEmbeds,
	createLink,
	createQueueEmbed,
	leavingEmbed,
	leftEmbed,
	successEmbed,
	errorEmbed,
}
