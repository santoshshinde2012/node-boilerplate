import { existsSync, mkdirSync } from 'fs';
import { Logger } from 'winston';
import winston = require('winston');

const logDir = './logs';

if (!existsSync(logDir)) {
	mkdirSync(logDir);
}

const logger: Logger = winston.createLogger({
	format: winston.format.json(),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: `${logDir}/combined.log` }),
	],
});

export default logger;
