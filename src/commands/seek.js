const { sendEmbed } = require("../utils/embeds")

module.exports = {
	aliases: ["seek"],
	name: "seek",
	requiresPlayer: true,
	async execute(msg, args, embed, bot, serverQueue) {

		const time = validateTimestamp(args[1], serverQueue.node.totalDuration)

		if (time === false) {
			embed.setDescription(
				"**" +
             args[1] +
             "** is not a valid timestamp format, correct format should be **hh:mm:ss**.",
			)
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		if (time === -1) {
			embed.setDescription(
				"**" +
          args[1] +
          "** is not a valid timestamp in this track, check this song's total duration.",
			)
			return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
		}

		const dur = `${serverQueue.currentTrack.duration.padStart(5, "0")}`
		await serverQueue.node.seek(time)

		const timestamp = millisecondsToTimestamp(time)
		embed.setDescription("Track playback time set to **" + timestamp + "/" + dur + "**",)

		return sendEmbed(msg.channel, { embeds: [embed] }, 20000)
	},
}

function validateTimestamp(timestamp, maxDuration) {
	const timestampComponents = timestamp.split(":").map(Number)
	const numComponents = timestampComponents.length

	if (
		numComponents < 1 ||
    numComponents > 3 ||
    timestampComponents.some((num) => isNaN(num))
	) {
		return false
	}

	let totalMS, seconds, minutes, hours

	if (numComponents === 1) {
		seconds = timestampComponents
		if (seconds < 0 || seconds > maxDuration) {
			return false
		}
		totalMS = seconds * 1000
	} else if (numComponents === 2) {
		[minutes, seconds] = timestampComponents
		if (minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
			return false
		}
		totalMS = minutes * 60000 + seconds * 1000
	} else {
		[hours, minutes, seconds] = timestampComponents
		if (
			hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59 ||
      seconds < 0 ||
      seconds > 59
		) {
			return false
		}
		totalMS = hours * 3600000 + minutes * 60000 + seconds * 1000
	}

	if (totalMS > maxDuration) return -1

	return totalMS
}

function millisecondsToTimestamp(milliseconds) {
	const totalSeconds = Math.floor(milliseconds / 1000)
	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	const seconds = totalSeconds % 60

	if (hours > 0) {
		const formattedHours = String(hours).padStart(2, "0")
		const formattedMinutes = String(minutes).padStart(2, "0")
		const formattedSeconds = String(seconds).padStart(2, "0")
		return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
	} else {
		const formattedMinutes = String(minutes).padStart(2, "0")
		const formattedSeconds = String(seconds).padStart(2, "0")
		return `${formattedMinutes}:${formattedSeconds}`
	}
}
