const fs = require("fs")
const path = require("node:path")

function getServerPrefixFromJson(serverID) {
	const serverConfigs = require("../servers.json")
	for (let i in serverConfigs) {
		if (serverID === serverConfigs[i].id) return serverConfigs[i].prefix
	}
	return require("../config.json").prefix
}

function getAdminsFromJson() {
	return require("../config.json").adminIDs
}

function saveJsonToFile(filename, json) {
	fs.writeFile(filename, json, function (err) {
		if (err) console.log(err)
	})
}

function setNewPrefix(serverID, prefix) {
	const serverConfigs = require("../servers.json")
	for (let i in serverConfigs) {
		if (serverID === serverConfigs[i].id) {
			serverConfigs[i].prefix = prefix
			saveJsonToFile("../servers.json", JSON.stringify(serverConfigs))
			return
		}
	}
	serverConfigs.push({ id: serverID, prefix: prefix })
	saveJsonToFile("../servers.json", JSON.stringify(serverConfigs))
}

function getAllFiles(folderPath) {
	let files = []
	const items = fs.readdirSync(folderPath)

	for (const item of items) {
		const filePath = path.join(folderPath, item)
		const stat = fs.statSync(filePath)

		if (stat.isDirectory()) {
			files = files.concat(getAllFiles(filePath))
		} else {
			files.push(filePath)
		}
	}

	return files
}

module.exports = {
	getAllFiles,
	setNewPrefix,
	getServerPrefixFromJson,
	getAdminsFromJson,
}
