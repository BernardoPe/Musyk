const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} = require("discord.js")

const { Util } = require("discord-player")
const config = require("../config.json")

const botID = config.botID
const inviteLink = config.inviteLink

function createLink() {
	const link = new ButtonBuilder()
		.setLabel("Invite Link")
		.setURL(inviteLink)
		.setStyle(ButtonStyle.Link)
	return new ActionRowBuilder().addComponents(link)
}

function helpEmbeds() {
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
		.setColor(0x58b9ff)

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
		.setColor(0x58b9ff)

	const embed3 = new EmbedBuilder()
		.setTitle("Command List")
		.setDescription(
			"Musyk commands start with the default prefix '.'. This prefix can be changed with the slash command '/prefix'. Available commands are listed below.\n\n" +
        "**/prefix <new prefix> ** : Set a new command prefix for this server. If 'current' or 'curr' is provided this command will display the current prefix. \n\n" +
        "**.play <song name / url>** : Play a song/playlist or add it to the music queue.\n\n" +
        "**.stop**: Stop the current playback and clear the music queue.\n\n" +
        "**.skip**: Skip the currently playing song and play the next song in the queue.\n\n" +
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
		.setColor(0x58b9ff)

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
		)
		.setColor(0x58b9ff)

	//let embed4 = new EmbedBuilder()
	//    .setTitle('Play Filters')
	//    .setDescription("Through the **.filter <filter>** command, you can set filters for the audio player.\n\n"
	//                    + "Available filters are: bassboost, 8D, vaporwave, nightcore, phaser, tremolo, vibrato, reverse, treble, normalizer, normalizer2, surrounding, pulsator, subboost, karaoke, flanger, gate, hass, mcompand, mono, mstlr, mstrr, compress, expander, softlimiter, chorus, chorus2d, chorus3d, fadein, dim, and lofi.\n\n"
	//                    + "If you pass 'disableall' as the argument, all filters will be disabled.")
	//    .setColor(0x58b9ff);
	//

	const embed5 = new EmbedBuilder()
		.setTitle("Aditional Information")
		.setDescription(
			"Make sure Musyk has the necessary permissions to join voice channels and manage music playback.",
		)
		.setColor(0x58b9ff)

	return [embed1, embed2, embed3, embed4, embed5]
}

function createButtons() {
	const commands = [
		"skip",
		"pause",
		"stop",
		"increaseVolume",
		"decreaseVolume",
		"shuffle",
		"reverse",
		"queue",
		"cycle",
		"autoplay",
	]
	const emojis = ["⏭️", "⏯️", "⏹️", "🔊", "🔉", "🔀", "🔃", "🕒", "🔄", "🤖"]

	const rows = Array(Math.floor(commands.length / 5))

	for (let i = 0; i < rows.length; i++) {
		rows[i] = new ActionRowBuilder()
	}

	for (let i = 0; i < commands.length; i++) {
		const button = new ButtonBuilder()
			.setCustomId(commands[i])
			.setEmoji(emojis[i])
			.setStyle(ButtonStyle.Secondary)

		rows[Math.floor(i / 5)].addComponents(button)
	}

	return rows
}

function getEmoji(source, embed) {
	let emoji

	if (source.includes("youtube")) {
		emoji = "<:YouTube1:1124140924876902411>"
		embed ? embed.setColor(0xed4245) : embed
	} else if (source.includes("spotify")) {
		emoji = "<:SpotifyLogo:1124141017260634262>"
		embed ? embed.setColor(0x57f287) : embed
	} else {
		emoji = "<:4678_SoundCloud:1124303937017745469>"
		embed ? embed.setColor(0xe67e22) : embed
	}
	return emoji
}

function createQueueEmbed(serverQueue) {
	const pages = []
	const tracks = serverQueue.tracks.toArray()

	let size = 0
	let page = 1

	while (size < tracks.length) {
		let embed = new EmbedBuilder()
		let curr = serverQueue.currentTrack
		let duration = `(${curr.duration.padStart(5, "0")})`

		embed
			.setTitle(`Current Queue Page ${page}`)
			.addFields({
				name: "Currently playing",
				value: `[${curr.cleanTitle}](${curr.url}) ${duration}`,
			})
			.setDescription(null)
			.setColor(0x01ff34)

		for (let i = 0; i < 10 && size < tracks.length; i++) {
			let song = tracks[size]
			let duration = `(${song.duration.padStart(5, "0")})`
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

function queuePlaylistEmbed(playlist) {
	const type = playlist.tracks[0].source
	const embed = new EmbedBuilder()
	const emoji = getEmoji(type, embed)

	const thumbnail = playlist.thumbnail.includes("null") ? playlist.tracks[0].thumbnail : playlist.thumbnail

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

function nowPlayingEmbed(queue) {

	const embed = new EmbedBuilder()
	const emoji = getEmoji(queue.currentTrack.source, embed)
	const song = queue.currentTrack

	embed
		.setTitle("Now Playing")
		.setDescription(`${emoji} **[${song.cleanTitle}](${song.url})**`)
		.setThumbnail(`${song.thumbnail}`)

	if (queue.history.nextTrack) {
		embed.addFields(
			{
				name: "Duration",
				value: `${song.duration.padStart(5, "0")}`,
				inline: true,
			},
			{ name: "Requested By", value: `${song.requestedBy}`, inline: true },
			{ name: "Songs in queue", value: `${queue.size}`, inline: true },
			{
				name: "Total queue duration",
				value: `${queue.durationFormatted}`,
				inline: true,
			},
			{
				name: "Next Track",
				value: `${getEmoji(queue.history.nextTrack.source)} **[${
					queue.history.nextTrack.cleanTitle
				}](${queue.history.nextTrack.url})**`,
				inline: true,
			},
			{
				name: "Volume",
				value: `${queue.node.volume}%`,
				inline: true,
			},
			{
				name: "Progress",
				value: `${progressBar(queue, { length: 20 })}`,
				inline: false,
			}
		)
	} else {
		embed.addFields(
			{
				name: "Duration",
				value: `${song.duration.padStart(5, "0")}`,
				inline: true,
			},
			{ name: "Requested By", value: `${song.requestedBy}`, inline: true },
			{ name: "Volume", value: `${queue.node.volume}%`, inline: true },
			{
				name: "Progress",
				value: `${progressBar(queue, { length: 20 })}`,
				inline: false,
			}
		)
	}

	return embed
}

function songQueuedEmbed(song, queue) {
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
				value: `${song.duration.padStart(5, "0")}`,
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

function updatePlayer(queue) {

	queue.updating = true

	const embed = nowPlayingEmbed(queue)

	if (!queue.metadata[2]) return

	const data = queue.metadata[2]

	data.edit({
		embeds: [embed],
	})

	queue.updating = false

}

function handlePlayer(queue) {
	if(!queue.metadata[2]) return 
	const randTime = Math.floor(Math.random() * 3000) + 1000
	Util.wait(randTime).then(() => {
		if(queue.isPlaying()) updatePlayer(queue)
		handlePlayer(queue)
	})
}

function progressBar(queue, options) {
	const total = {
		value: queue.currentTrack.durationMS,
		label: queue.currentTrack.duration,
	}
	const current = {
		value: queue.node.estimatedPlaybackTime,
		label: Util.formatDuration(queue.node.estimatedPlaybackTime),
	}
	if (!total|| !current)
		return null
	const { indicator = "\u{1F518}", leftChar = "\u25AC", rightChar = "\u25AC", length = 15, timecodes = true, separator = "\u2503" } = options || {}
	const index = Math.round(current.value / total.value * length)
	if (index >= 1 && index <= length) {
		const bar = leftChar.repeat(index - 1).split("")
		bar.push(indicator)
		bar.push(rightChar.repeat(length - index))
		if (timecodes) {
			return `${current.label} ${separator} ${bar.join("")} ${separator} ${total.label}`
		} else {
			return `${bar.join("")}`
		}
	} else {
		if (timecodes) {
			return `${current.label} ${separator} ${indicator}${rightChar.repeat(length - 1)} ${separator} ${total.label}`
		} else {
			return `${indicator}${rightChar.repeat(length - 1)}`
		}
	}
}

async function sendEmbed(channel, info, timeout) {
	if (!channel) return
	const bot = channel.members.get(botID)
	if (!bot) return
	if (!channel.permissionsFor(bot).has("SendMessages")) return
	if (!timeout) return channel.send(info)

	return channel.send(info).then(async (msg) => {
		await Util.wait(timeout)
		msg.delete()
	})
}

module.exports = {
	sendEmbed,
	updatePlayer,
	createButtons,
	queuePlaylistEmbed,
	nowPlayingEmbed,
	songQueuedEmbed,
	helpEmbeds,
	createLink,
	createQueueEmbed,
	handlePlayer
}
