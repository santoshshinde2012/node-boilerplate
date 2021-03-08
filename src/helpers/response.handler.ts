import { Request, Response } from "express";
import * as HttpStatus from 'http-status-codes';
import * as logger from 'winston';

/**
 * Error response
 * @param req
 * @param res
 */
export const JSONERROR = (req: Request, res: Response) => {
    const errorCode: number = res.locals.errorCode || HttpStatus.BAD_REQUEST;
    const obj = {
        status: 'failure',
        data: res.locals.data || {},
        errors: res.locals.errors || {},
        message: res.locals.message || '',
    }
    const err = res.locals.error;
    logger.error(err.name);
    logger.error(err.message);
    logger.error(err.stack);
    res.status(errorCode).send(obj);
}

/**
 * Success response
 * @param req
 * @param res
 */
export const JSONSUCCESS = (req: Request, res: Response) => {
    let obj = {
        status: 'success',
        data: {},
        errors: {},
        message: '',
    };

    if (res.locals.data) {
        obj.data = res.locals.data;
    }
    if (res.locals.errors) {
        obj.errors = res.locals.errors;
    }
    if (res.locals.message) {
        obj.message = res.locals.message;
    }

    res.status(HttpStatus.OK).send(obj);
}