const { generateTrustedToken } = require("discord-player-youtubei")
const { parentPort } = require("node:worker_threads")

generateTrustedToken(
	{
		puppeteerOptions: {
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"]
		},
	}
).then((v) => {
	parentPort.postMessage(v)
})