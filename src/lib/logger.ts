import * as winston from 'winston';

const logDir = './logs';

export type Logger = winston.Logger;

const logger: Logger = winston.createLogger({
	format: winston.format.json(),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: `${logDir}/combined.log` }),
	],
});

export default logger;
