import {Colors, EmbedBuilder} from "discord.js"

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

export {helpEmbeds}