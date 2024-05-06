import util from 'util';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../abstractions/ApiError';
import logger from '../lib/logger';
import { getEncryptedText } from '../utils';


const addErrorHandler = (
	err: ApiError | null,
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	if (err) {
		const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
		const errorMessage = err.message || 'An error occurred during the request.';
		const errorDetails = {
			fields: err.fields,
			message: errorMessage,
			name: err.name,
			status,
		};

		// Logging error details
		logger.error(`REQUEST HANDLING ERROR:
            \nERROR:\n${JSON.stringify(err)}
            \nREQUEST HEADERS:\n${util.inspect(req.headers)}
            \nREQUEST PARAMS:\n${util.inspect(req.params)}
            \nREQUEST QUERY:\n${util.inspect(req.query)}
            \nBODY:\n${util.inspect(req.body)}`);

		// Encrypting error details if encryption is enabled
		const body = getEncryptedText(errorDetails);

		res.status(status).send(body);
	} else {
		next();
	}
};


export default addErrorHandler;
