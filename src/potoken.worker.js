const { generateTrustedToken } = require("discord-player-youtubei")
const { parentPort } = require("node:worker_threads")



generateTrustedToken({
	puppeteerOptions: {
		args: ["--no-sandbox", "--disable-setuid-sandbox", "--headless"],
	},
}).then((v) => {
	parentPort.postMessage(v)
})