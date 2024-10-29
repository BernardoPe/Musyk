import fs from "fs"
import {logger} from "../logging/logger.ts"
import path from "path"

function saveJsonToFile(filename: string, json: string) {
	fs.writeFile(filename, json, function (err) {
		if (err) logger.error(err)
	})
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


export { saveJsonToFile, getAllFiles }