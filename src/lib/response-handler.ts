import { Response } from 'express';
import {
    StatusCodes,
} from 'http-status-codes';
import logger from './logger';

function send(res: Response): void {
    let obj = {};
    obj = res.locals.data;
    logger.info(JSON.stringify(obj, null, 2));
    res.status(StatusCodes.OK).send(obj);
}

function json(res: Response): void {
    let obj = {};
    obj = res.locals.data;
    logger.info(JSON.stringify(obj, null, 2));
    res.status(StatusCodes.OK).json(obj);
}

export {
    send,
    json
};