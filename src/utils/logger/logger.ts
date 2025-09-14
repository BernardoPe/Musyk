import * as winston from "winston"

const timestamp = winston.format.timestamp

const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || "info",
	format: winston.format.combine(
		winston.format.combine(timestamp(), winston.format.simple()),
		winston.format.printf((info) => `[${info.timestamp}] ${info.message}`)
	),
	transports: [
		new winston.transports.File({
			filename: "../logs.log",
			level: process.env.LOG_LEVEL || "info",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.simple(),
				winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
			),
		}),
		new winston.transports.Console({
			level: process.env.LOG_LEVEL || "info",
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple(),
				winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
			),
		}),
	],
})

export { logger }
