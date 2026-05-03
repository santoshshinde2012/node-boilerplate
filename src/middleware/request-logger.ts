import { NextFunction, Request, Response } from 'express';
import logger from '../lib/logger';

export default function requestLogger(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const start = process.hrtime.bigint();

	res.on('finish', () => {
		const durationMs =
			Number(process.hrtime.bigint() - start) / 1_000_000;
		const meta = {
			requestId: req.id,
			method: req.method,
			path: req.originalUrl,
			status: res.statusCode,
			durationMs: Number(durationMs.toFixed(2)),
			ip: req.ip,
			userAgent: req.headers['user-agent'],
		};

		if (res.statusCode >= 500) {
			logger.error('request', meta);
		} else if (res.statusCode >= 400) {
			logger.warn('request', meta);
		} else {
			logger.info('request', meta);
		}
	});

	next();
}
