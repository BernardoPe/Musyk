function validateTimestamp(timestamp: string, maxDuration: number): number | boolean {
	const timestampComponents = timestamp.split(":").map(Number)
	const numComponents = timestampComponents.length

	if (numComponents < 1 || numComponents > 3 || timestampComponents.some((num) => isNaN(num))) {
		return false
	}

	if (!validTimestampMapping[numComponents](...timestampComponents)) return -1

	const totalMS: number = totalMsMapping[numComponents](...timestampComponents)

	if (totalMS > maxDuration) return -1

	return totalMS
}

function millisecondsToTimestamp(milliseconds: number): string {
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

const totalMsMapping: Record<number, (...args: number[]) => number> = {
	1: (seconds: number) => seconds * 1000,
	2: (minutes: number, seconds: number) => minutes * 60 * 1000 + seconds * 1000,
	3: (hours: number, minutes: number, seconds: number) =>
		hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000,
}

const validTimestampMapping: Record<number, (...args: number[]) => boolean> = {
	1: (seconds: number) => seconds >= 0 && seconds <= 59,
	2: (minutes: number, seconds: number) => minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59,
	3: (hours: number, minutes: number, seconds: number) =>
		hours >= 0 && hours <= 59 && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59,
}

export { validateTimestamp, millisecondsToTimestamp }
