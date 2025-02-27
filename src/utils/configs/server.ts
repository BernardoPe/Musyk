import { Snowflake } from "discord.js"
import { ServerPrefix } from "../../types.ts"
import "dotenv/config"
import fs from "fs"
import path from "path"
import { Language } from "../../langs"

const defaultPrefix: ServerPrefix = process.env.BOT_PREFIX || "."
const defaultLang: string = process.env.DEFAULT_LANG || "en"
const admins: Array<Snowflake> = (process.env.ADMINS || "").split(",")

const serverConfigsPath = path.join(__dirname, "../../servers.json")
const langsPath = path.join(__dirname, "../../langs")

type ServerConfig = {
    prefix: ServerPrefix;
    lang: string;
};

type ServerConfigs = {
    [serverId: string]: ServerConfig;
};

function getServerPrefix(serverID: Snowflake): ServerPrefix {
	const serverConfigs: ServerConfigs = JSON.parse(fs.readFileSync(serverConfigsPath, "utf-8"))
	return serverConfigs[serverID]?.prefix || defaultPrefix
}

async function setNewPrefix(serverID: Snowflake, prefix: ServerPrefix) {
	await doFileTransaction(serverConfigsPath, (serverConfigs) => {
		serverConfigs[serverID] = { ...serverConfigs[serverID], prefix: prefix }
		return serverConfigs
	})
}

function getLang(serverId: Snowflake): Language {
	const serverConfigs = JSON.parse(fs.readFileSync(serverConfigsPath, "utf-8"))
	const lang = serverConfigs[serverId]?.lang || defaultLang
	return require(`${langsPath}/${lang}.json`)
}

async function setNewLang(serverId: Snowflake, lang: string) {
	await doFileTransaction(serverConfigsPath, (serverConfigs) => {
		serverConfigs[serverId] = { ...serverConfigs[serverId], lang: lang }
		return serverConfigs
	})
}

type FileTransactionCallback = (file: any) => any;

async function doFileTransaction(path: string, callback: FileTransactionCallback) {
	const file = JSON.parse(fs.readFileSync(path, "utf-8"))
	const res = callback(file)
	fs.writeFileSync(path, JSON.stringify(res, null, 2))
}

function getAdmins(): Array<Snowflake> {
	return admins
}

export { getServerPrefix, getAdmins, setNewPrefix, getLang, setNewLang }
