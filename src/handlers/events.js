const { getAllFiles } = require("../utils/configs.js")
const path = require("node:path")

function addEventListeners(
	bot,
	folderPath = path.join(__dirname, "../listeners"),
) {
	const files = getAllFiles(folderPath)

	for (const file of files) {
		const event = require(file)
		const listener = file.includes("player") ? bot.player.events : bot

		event.once
			? listener.once(event.name, (...args) => event.execute(...args, bot))
			: listener.on(event.name, (...args) => event.execute(...args, bot))
	}
}

module.exports = { addEventListeners }
