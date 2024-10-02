const { generateTrustedToken } = require("discord-player-youtubei")
const { parentPort } = require("node:worker_threads")

generateTrustedToken().then((v) => {
	parentPort.postMessage(v)
})