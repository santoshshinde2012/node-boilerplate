import compression from 'compression';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { StatusCodes } from 'http-status-codes';

import swaggerDocument from '../swagger.json';
import config from './config';
import logger from './lib/logger';
import registerRoutes from './routes';
import addErrorHandler from './middleware/error-handler';
import requestId from './middleware/request-id';
import requestLogger from './middleware/request-logger';
import ApiError from './abstractions/ApiError';
import { IBaseResponse } from './types/IBaseResponse';

export default class App {
	public express!: express.Application;

	public httpServer!: http.Server;

	public async init(): Promise<void> {
		this.express = express();
		this.httpServer = http.createServer(this.express);

		// trust the first hop reverse proxy (rate-limit + req.ip rely on this)
		if (config.security.trustProxy) {
			this.express.set('trust proxy', 1);
		}

		// disable the default Express signature header
		this.express.disable('x-powered-by');

		this.middleware();

		// Swagger UI is mounted before route registration so the 404 handler
		// (registered last) doesn't swallow `/docs` requests.
		if (!config.isProduction) {
			this.setupSwaggerDocs();
		}

		this.routes();

		// 404 handler – must be after all routes, before the error handler
		this.express.use(this.notFoundHandler);

		// global error handler – must be the last middleware
		this.express.use(addErrorHandler);
	}

	private routes(): void {
		this.express.get('/', this.basePathRoute);
		this.express.get('/healthz', this.healthCheck);
		this.express.get('/readyz', this.healthCheck);
		this.express.get(
			'/web',
			this.parseRequestHeader.bind(this),
			this.basePathRoute,
		);
		this.express.use('/', registerRoutes());
	}

	private middleware(): void {
		// security headers
		this.express.use(
			helmet({
				contentSecurityPolicy: config.isProduction ? undefined : false,
				crossOriginEmbedderPolicy: false,
				hsts: config.isProduction
					? { maxAge: 15552000, includeSubDomains: true }
					: false,
			}),
		);

		// body parsing with safe limits (was 100mb – DoS vector)
		this.express.use(express.json({ limit: config.security.bodyLimit }));
		this.express.use(
			express.urlencoded({
				limit: config.security.bodyLimit,
				extended: true,
			}),
		);

		// gzip / brotli where supported
		this.express.use(compression());

		// per-request id and structured access log
		this.express.use(requestId);
		this.express.use(requestLogger);

		// CORS – allow-list driven; reject unknown origins
		this.express.use(cors(this.buildCorsOptions()));

		// global rate limit
		this.express.use(
			rateLimit({
				windowMs: config.security.rateLimit.windowMs,
				limit: config.security.rateLimit.max,
				standardHeaders: 'draft-7',
				legacyHeaders: false,
				skip: (req) =>
					req.path === '/healthz' || req.path === '/readyz',
			}),
		);
	}

	private buildCorsOptions(): cors.CorsOptions {
		const allowed = config.security.corsOrigins;

		if (allowed === '*') {
			return { origin: true };
		}

		if (!allowed.length) {
			// no origins configured ⇒ same-origin only
			return { origin: false };
		}

		return {
			origin: (
				origin: string | undefined,
				callback: (err: Error | null, allow?: boolean) => void,
			) => {
				// allow non-browser / same-origin requests
				if (!origin) return callback(null, true);
				if (allowed.includes(origin)) return callback(null, true);
				return callback(new Error('Not allowed by CORS'), false);
			},
			credentials: true,
		};
	}

	private parseRequestHeader(
		req: Request,
		_res: Response,
		next: NextFunction,
	): void {
		const xInternalAuthorization = req.headers['x-internal-authorization'];
		const authorization = req.headers['authorization'];

		if (!xInternalAuthorization) {
			return next(
				new ApiError(
					'Internal Token Missing',
					StatusCodes.UNAUTHORIZED,
					'InternalTokenMissing',
				),
			);
		}
		if (!authorization) {
			return next(
				new ApiError(
					'External Token Missing',
					StatusCodes.UNAUTHORIZED,
					'ExternalTokenMissing',
				),
			);
		}
		next();
	}

	private basePathRoute(_req: Request, res: Response): void {
		const result: IBaseResponse = { message: 'base path' };
		res.json(result);
	}

	private healthCheck(_req: Request, res: Response): void {
		res.status(StatusCodes.OK).json({
			status: 'ok',
			uptime: process.uptime(),
			timestamp: new Date().toISOString(),
		});
	}

	private notFoundHandler(
		req: Request,
		_res: Response,
		next: NextFunction,
	): void {
		next(
			new ApiError(
				`Route ${req.method} ${req.originalUrl} not found`,
				StatusCodes.NOT_FOUND,
				'NotFound',
			),
		);
	}

	private setupSwaggerDocs(): void {
		try {
			this.express.use(
				'/docs',
				swaggerUi.serve,
				swaggerUi.setup(swaggerDocument),
			);
		} catch (error) {
			logger.warn('Failed to mount swagger docs', { error });
		}
	}
}
