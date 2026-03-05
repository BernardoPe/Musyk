import fs from "node:fs"
import path from "node:path"

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

export { getAllFiles }
