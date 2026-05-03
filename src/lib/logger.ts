import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';
import config from '../config';

export type Logger = winston.Logger;

const logDir = path.resolve('logs');

const transports: winston.transport[] = [
	new winston.transports.Console({
		// silence noisy console output during tests
		silent: config.isTest,
	}),
];

// File transports are best-effort — only enabled when the directory is writable.
if (!config.isTest) {
	try {
		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir, { recursive: true });
		}
		transports.push(
			new winston.transports.File({
				filename: path.join(logDir, 'error.log'),
				level: 'error',
			}),
			new winston.transports.File({
				filename: path.join(logDir, 'combined.log'),
			}),
		);
	} catch {
		// read-only filesystem (e.g. some container setups) — skip file transports.
	}
}

const logger: Logger = winston.createLogger({
	level: config.logLevel,
	defaultMeta: { service: 'node-boilerplate', env: config.nodeEnv },
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.json(),
	),
	transports,
	exitOnError: false,
});

export default logger;
