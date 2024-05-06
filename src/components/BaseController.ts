import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getEncryptedText } from '../utils';

/**
 * Base Controller
 */
export default abstract class BaseController {
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
		const encryptedData = getEncryptedText(res.locals.data);
		res.status(statusCode).send(encryptedData);
	}
}
