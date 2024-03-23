import { existsSync, mkdirSync } from 'fs';
import { Logger, createLogger, format, transports } from 'winston';

const logDir = './logs';

if (!existsSync(logDir)) {
	mkdirSync(logDir);
}

const logger: Logger = createLogger({
	format: format.json(),
	transports: [
		new transports.Console(),
		new transports.File({ filename: `${logDir}/combined.log` }),
	],
});

export default logger;
