import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import Crypto from '../lib/crypto';

/**
 * Provides services common to all API methods
 */
export default abstract class BaseApi {
	protected router: Router;

	constructor() {
		this.router = Router();
	}

	public abstract register(): void;

	/**
	 * Global method to send API response
	 * @param res
	 * @param statusCode
	 */
	public send(res: Response, statusCode: number = StatusCodes.OK): void {
		let obj = {};
		obj = res.locals.data;
		if (process.env.APPLY_ENCRYPTION && process.env.SECRET_KEY) {
			obj = Crypto.encrypt(JSON.stringify(obj), process.env.SECRET_KEY);
		}
		res.status(statusCode).send(obj);
	}
}
