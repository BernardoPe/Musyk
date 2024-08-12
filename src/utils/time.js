const validTimestampMapping = {
	1: (seconds) => seconds < 0 || seconds > maxDuration,
	2: (minutes, seconds) => minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59,
	3: (hours, minutes, seconds) => hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59,
}

const totalMsMapping = {
	1: (seconds) => seconds * 1000,
	2: (minutes, seconds) => minutes * 60000 + seconds * 1000,
	3: (hours, minutes, seconds) => hours * 3600000 + minutes * 60000 + seconds * 1000,
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

	if (validTimestampMapping[numComponents](...timestampComponents)) return -1

	const totalMS = totalMsMapping[numComponents](...timestampComponents)

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

module.exports = { validateTimestamp, millisecondsToTimestamp }