import { Snowflake } from "discord.js"
import { ServerPrefix } from "../../types.ts"
import { saveJsonToFile } from "./json.ts"
import "dotenv/config"

const defaultPrefix: ServerPrefix = process.env.BOT_PREFIX || "."
const admins: Array<Snowflake> = (process.env.ADMINS || "").split(",")

function getServerPrefix(serverID: Snowflake): ServerPrefix {
	const serverConfigs = require("../../servers.json")
	for (const i in serverConfigs) {
		if (serverID === serverConfigs[i].id) return serverConfigs[i].prefix
	}
	return defaultPrefix
}

function setNewPrefix(serverID: Snowflake, prefix: ServerPrefix) {
	const serverConfigs = require("../../servers.json")
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

function getAdmins(): Array<Snowflake> {
	return admins
}

export { getServerPrefix, getAdmins, setNewPrefix }
