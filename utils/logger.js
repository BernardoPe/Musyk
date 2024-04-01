const winston = require("winston")

const timestamp = winston.format.timestamp

const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.colorize({
			level: false,
			message: true,
			colors: {
				info: "cyan",
				error: "orange",
				warn: "yellow",
			},
		}),
		winston.format.combine(timestamp(), winston.format.simple()),
		winston.format.printf((info) => `[${info.timestamp}] ${info.message}`),
	),
	transports: [
		new winston.transports.File({
			filename: "logs.log",
			level: "info",
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.simple(),
				winston.format.printf(
					(info) => `[${info.timestamp}] ${info.level}: ${info.message}`,
				),
			),
		}),
		new winston.transports.Console({ level: "info" }),
	],
})

module.exports = { logger }
