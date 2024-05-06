import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import addErrorHandler from '../../../src/middleware/error-handler';
import logger from '../../../src/lib/logger';
import { getEncryptedText } from '../../../src/utils';
import ApiError from '../../../src/abstractions/ApiError';

jest.mock('../../../src/lib/logger', () => ({
    error: jest.fn(),
}));

jest.mock('../../../src/utils', () => ({
    getEncryptedText: jest.fn((errorDetails) => JSON.stringify(errorDetails)),
}));

describe('addErrorHandler', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock<NextFunction, []>;

    beforeEach(() => {
        req = {
            headers: {},
            params: {},
            query: {},
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should send encrypted error response', () => {
        const err = new Error('Test Error') as ApiError;
        err.status = StatusCodes.BAD_REQUEST;

        addErrorHandler(err, req as Request, res as Response, next);

        expect(logger.error).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
        expect(getEncryptedText).toHaveBeenCalledWith({
            fields: undefined,
            message: 'Test Error',
            name: 'Error',
            status: StatusCodes.BAD_REQUEST,
        });
        expect(res.send).toHaveBeenCalledWith(JSON.stringify({
            fields: undefined,
            message: 'Test Error',
            name: 'Error',
            status: StatusCodes.BAD_REQUEST,
        }));
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next if no error', () => {
        addErrorHandler(null, req as Request, res as Response, next);
        
        expect(logger.error).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it('should handle error without status', () => {
        const err = new Error('Test Error') as ApiError;

        addErrorHandler(err, req as Request, res as Response, next);

        expect(logger.error).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(getEncryptedText).toHaveBeenCalledWith({
            fields: undefined,
            message: 'Test Error',
            name: 'Error',
            status: StatusCodes.INTERNAL_SERVER_ERROR,
        });
        expect(res.send).toHaveBeenCalledWith(JSON.stringify({
            fields: undefined,
            message: 'Test Error',
            name: 'Error',
            status: StatusCodes.INTERNAL_SERVER_ERROR,
        }));
        expect(next).not.toHaveBeenCalled();
    });
});
