import * as express from 'express';
import * as util from 'util';
import {
  StatusCodes,
} from 'http-status-codes';
import logger from '../lib/logger';
import ApiError from '../abstractions/ApiError';
import { Environments } from '../environments/environment.constant';

const addErrorHandler = (
  err: ApiError, req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void => {

  if (err) {
    const status: number = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
    logger.debug(`REQUEST HANDLING ERROR:
        \nERROR:\n${JSON.stringify(err)}
        \nREQUEST HEADERS:\n${util.inspect(req.headers)}
        \nREQUEST PARAMS:\n${util.inspect(req.params)}
        \nREQUEST QUERY:\n${util.inspect(req.query)}
        \nBODY:\n${util.inspect(req.body)}`);
    const body = {
      fields: err.fields,
      message: err.message || 'An error occurred during the request.',
      name: err.name,
      status,
      stack: '',
    };

    // If the environment is production then no need to send error stack trace
    if(process.env.NODE_ENV === Environments.PRODUCTION) {
      body.stack = err.stack;
    }

    res.status(status).json(body);
  }
  next();
};

export default addErrorHandler;
