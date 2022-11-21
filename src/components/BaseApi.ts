import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import Crypto from '../lib/crypto';
import logger from '../lib/logger';

/**
 * Provides services common to all API methods
 */
export default abstract class BaseApi {
	protected router: Router;

	protected constructor() {
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
		if (
			environment.isProductionEnvironment() ||
			environment.isTestEnvironment()
		) {
			logger.info(JSON.stringify(obj, null, 2));
		}
		if (environment.applyEncryption) {
			obj = Crypto.encrypt(JSON.stringify(obj), environment.secretKey);
		}
		res.status(statusCode).send(obj);
	}
}
