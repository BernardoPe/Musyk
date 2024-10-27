import * as fs from "fs"
import * as path from "path"
import { ServerPrefix } from "../types.ts"
import { Snowflake } from "discord.js"
import "dotenv/config"
import { logger } from "./logger.ts"

const defaultPrefix: ServerPrefix = process.env.BOT_PREFIX || "."
const admins: Array<Snowflake> = (process.env.ADMINS || "").split(",")

function getServerPrefix(serverID: Snowflake): ServerPrefix {
	const serverConfigs = require("../servers.json")
	for (const i in serverConfigs) {
		if (serverID === serverConfigs[i].id) return serverConfigs[i].prefix
	}
	return defaultPrefix
}

function getAdmins(): Array<Snowflake> {
	return admins
}

function saveJsonToFile(filename: string, json: string) {
	fs.writeFile(filename, json, function (err) {
		if (err) logger.error(err)
	})
}

function setNewPrefix(serverID: Snowflake, prefix: ServerPrefix) {
	const serverConfigs = require("../servers.json")
	for (const i in serverConfigs) {
		if (serverID === serverConfigs[i].id) {
			serverConfigs[i].prefix = prefix
			saveJsonToFile("../servers.json", JSON.stringify(serverConfigs))
			return
		}
	}
	serverConfigs.push({ id: serverID, prefix: prefix })
	saveJsonToFile("../servers.json", JSON.stringify(serverConfigs))
}

function getAllFiles(folderPath: string): string[] {
	let files: string[] = []
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

export { getServerPrefix, getAdmins, setNewPrefix, getAllFiles }
