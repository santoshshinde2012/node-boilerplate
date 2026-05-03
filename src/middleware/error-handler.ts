import * as express from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import ApiError from '../abstractions/ApiError';
import logger from '../lib/logger';
import config from '../config';

interface ErrorResponseBody {
	status: number;
	name: string;
	message: string;
	requestId?: string;
	fields?: ApiError['fields'];
	stack?: string;
}

function safeReason(status: number): string {
	try {
		return getReasonPhrase(status);
	} catch {
		return 'Error';
	}
}

const addErrorHandler = (
	err: ApiError | Error | null | undefined,
	req: express.Request,
	res: express.Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_next: express.NextFunction,
): void => {
	if (!err) return;

	// If the response has already been sent, the only safe thing to do is
	// close the connection — Express' default handler will do that for us.
	if (res.headersSent) {
		return;
	}

	const apiErr = err as Partial<ApiError>;
	const status: number =
		(typeof apiErr.status === 'number' && apiErr.status) ||
		StatusCodes.INTERNAL_SERVER_ERROR;
	const name: string =
		(apiErr.name && String(apiErr.name)) || safeReason(status);
	const message: string =
		(apiErr.message && String(apiErr.message)) ||
		'An error occurred during the request.';

	logger.error('request error', {
		requestId: req.id,
		method: req.method,
		path: req.originalUrl,
		status,
		name,
		message,
		// stack only in non-production logs
		stack: config.isProduction ? undefined : (err as Error)?.stack,
	});

	const body: ErrorResponseBody = {
		status,
		name,
		message,
		requestId: req.id,
	};

	if (apiErr.fields) {
		body.fields = apiErr.fields;
	}

	// expose stack only outside production to aid local debugging
	if (!config.isProduction && (err as Error)?.stack) {
		body.stack = (err as Error).stack;
	}

	res.status(status).json(body);
};

export default addErrorHandler;
