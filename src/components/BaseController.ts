import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RouteDefinition } from '../types/RouteDefinition';
import { getEncryptedText } from '../utils';

/**
 * Base Controller
 */
export default abstract class BaseController {
	public abstract routes(): RouteDefinition[];

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
