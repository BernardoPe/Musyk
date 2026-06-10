import en from "../src/langs/data/en.json"
import ptPt from "../src/langs/data/pt-pt.json"

type LangFile = { file: string; data: Record<string, unknown> }

const REFERENCE: LangFile = { file: "en.json", data: en }
const OTHERS: LangFile[] = [{ file: "pt-pt.json", data: ptPt }]

function flatten(obj: Record<string, unknown>, prefix = ""): Map<string, string> {
	const result = new Map<string, string>()
	for (const [key, value] of Object.entries(obj)) {
		const path = prefix ? `${prefix}.${key}` : key
		if (value !== null && typeof value === "object") {
			for (const [k, v] of flatten(value as Record<string, unknown>, path)) {
				result.set(k, v)
			}
		} else {
			result.set(path, String(value))
		}
	}
	return result
}

function placeholders(value: string): string[] {
	return (value.match(/\{[a-zA-Z0-9_]+\}/g) ?? []).sort()
}

const referenceKeys = flatten(REFERENCE.data)
let failed = false

for (const other of OTHERS) {
	const otherKeys = flatten(other.data)

	for (const key of referenceKeys.keys()) {
		if (key === "tag" || key === "name") continue
		if (!otherKeys.has(key)) {
			console.error(`${other.file}: missing key "${key}" (present in ${REFERENCE.file})`)
			failed = true
		}
	}

	for (const key of otherKeys.keys()) {
		if (!referenceKeys.has(key)) {
			console.error(`${other.file}: extra key "${key}" (absent in ${REFERENCE.file})`)
			failed = true
		}
	}

	for (const [key, refValue] of referenceKeys) {
		const otherValue = otherKeys.get(key)
		if (otherValue === undefined) continue
		const refTokens = placeholders(refValue).join(",")
		const otherTokens = placeholders(otherValue).join(",")
		if (refTokens !== otherTokens) {
			console.error(
				`${other.file}: placeholder mismatch for "${key}": [${otherTokens}] vs ${REFERENCE.file} [${refTokens}]`
			)
			failed = true
		}
	}
}

if (failed) {
	process.exit(1)
}
console.log(`Language parity OK (${OTHERS.length + 1} files, ${referenceKeys.size} keys)`)
