import { Snowflake } from "discord.js"
import { ServerPrefix } from "../../types.ts"
import { saveJsonToFile } from "./json.ts"
import "dotenv/config"
import { Util } from "discord-player"
import fs from "fs"
import path from "path"

const defaultPrefix: ServerPrefix = process.env.BOT_PREFIX || "."
const admins: Array<Snowflake> = (process.env.ADMINS || "").split(",")

function getServerPrefix(serverID: Snowflake): ServerPrefix {
	const serverConfigs = require("../../servers.json")
	for (const i in serverConfigs) {
		if (serverID === serverConfigs[i].id) return serverConfigs[i].prefix
	}
	return defaultPrefix
}

async function setNewPrefix(serverID: Snowflake, prefix: ServerPrefix) {
	const filePath = path.resolve(__dirname, "../../servers.json")
	const lockFilePath = `${filePath}.lock`

	while (fs.existsSync(lockFilePath)) {
		await Util.wait(1)
	}

	fs.writeFileSync(lockFilePath, "locked")

	try {
		const serverConfigs = require(filePath)
		for (const i in serverConfigs) {
			if (serverID === serverConfigs[i].id) {
				serverConfigs[i].prefix = prefix
				saveJsonToFile(filePath, JSON.stringify(serverConfigs))
				return
			}
		}
		serverConfigs.push({ id: serverID, prefix: prefix })
		saveJsonToFile(filePath, JSON.stringify(serverConfigs))
	} finally {
		fs.unlinkSync(lockFilePath)
	}
}

function getAdmins(): Array<Snowflake> {
	return admins
}

export { getServerPrefix, getAdmins, setNewPrefix }
