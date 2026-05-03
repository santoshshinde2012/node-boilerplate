import * as http from 'http';
import { AddressInfo } from 'net';
import App from './App';
import config from './config';
import logger from './lib/logger';

const SHUTDOWN_TIMEOUT_MS = 10_000;

const app: App = new App();
let server: http.Server;
let shuttingDown = false;

function serverError(error: NodeJS.ErrnoException): void {
	if (error.syscall !== 'listen') {
		throw error;
	}
	logger.error('Server failed to start', { error });
	process.exit(1);
}

function serverListening(): void {
	const addressInfo: AddressInfo = server.address() as AddressInfo;
	logger.info('Server listening', {
		host: addressInfo.address,
		port: addressInfo.port,
		env: config.nodeEnv,
	});
}

function shutdown(signal: string, exitCode = 0): void {
	if (shuttingDown) return;
	shuttingDown = true;
	logger.info('Shutdown signal received', { signal });

	const timer = setTimeout(() => {
		logger.error('Forced shutdown after timeout', {
			timeoutMs: SHUTDOWN_TIMEOUT_MS,
		});
		process.exit(1);
	}, SHUTDOWN_TIMEOUT_MS);
	timer.unref();

	if (!server) {
		process.exit(exitCode);
		return;
	}

	server.close((err) => {
		if (err) {
			logger.error('Error while closing server', { error: err });
			process.exit(1);
		}
		logger.info('Server closed cleanly');
		process.exit(exitCode);
	});
}

app.init()
	.then(() => {
		app.express.set('port', config.port);
		server = app.httpServer;

		// Production-grade timeouts to defeat slow-loris and stuck-keepalive
		// connections. Tuned for behind-LB deployments — increase for very
		// long-running uploads/downloads that don't sit behind a proxy.
		server.keepAliveTimeout = 65_000;
		server.headersTimeout = 66_000;
		server.requestTimeout = 30_000;

		server.on('error', serverError);
		server.on('listening', serverListening);
		server.listen(config.port);
	})
	.catch((err: Error) => {
		logger.error('app.init failed', {
			name: err.name,
			message: err.message,
			stack: err.stack,
		});
		process.exit(1);
	});

(['SIGINT', 'SIGTERM'] as const).forEach((signal) => {
	process.on(signal, () => shutdown(signal));
});

process.on('unhandledRejection', (reason: unknown) => {
	const err = reason instanceof Error ? reason : new Error(String(reason));
	logger.error('Unhandled promise rejection', {
		message: err.message,
		stack: err.stack,
	});
});

process.on('uncaughtException', (error: Error) => {
	logger.error('Uncaught exception', {
		name: error.name,
		message: error.message,
		stack: error.stack,
	});
	shutdown('uncaughtException', 1);
});
