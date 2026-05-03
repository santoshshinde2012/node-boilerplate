import * as crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

declare module 'express-serve-static-core' {
	interface Request {
		id?: string;
	}
}

const HEADER_NAME = 'x-request-id';
const MAX_INCOMING_LENGTH = 128;
const SAFE_PATTERN = /^[A-Za-z0-9._-]+$/;

function isSafeIncoming(value: string): boolean {
	return value.length > 0 && value.length <= MAX_INCOMING_LENGTH && SAFE_PATTERN.test(value);
}

export default function requestId(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const incoming = req.header(HEADER_NAME);
	const id = incoming && isSafeIncoming(incoming) ? incoming : crypto.randomUUID();
	req.id = id;
	res.setHeader(HEADER_NAME, id);
	next();
}
