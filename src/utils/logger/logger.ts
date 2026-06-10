import * as winston from "winston"
import path from "node:path"

const level = process.env.LOG_LEVEL || "info"
const logFile = process.env.LOG_FILE || path.join(process.cwd(), "logs.log")

const logFormat = winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)

const logger = winston.createLogger({
	level,
	format: winston.format.timestamp(),
	transports: [
		new winston.transports.File({
			filename: logFile,
			format: logFormat,
		}),
		new winston.transports.Console({
			format: winston.format.combine(winston.format.colorize(), logFormat),
		}),
	],
})

export { logger }
