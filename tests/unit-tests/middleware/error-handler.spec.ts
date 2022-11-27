import 'jest';
import express from 'express';
import { NextFunction, Request, Response } from 'express';
import addErrorHandler from '../../../src/middleware/error-handler';
import IntegrationHelpers from '../../helpers/Integration-helpers';
import { StatusCodes } from 'http-status-codes';

describe('ErrorHandler middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    let app: express.Application;
    
    beforeAll(async() => {
        app = await IntegrationHelpers.getApp();
    });

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status : jest.fn(),
            send: jest.fn()
        };
    });

    test('with 0 status code', async () => {
        const status: number = StatusCodes.INTERNAL_SERVER_ERROR;
        addErrorHandler({
            status: 0,
            success: false,
            fields: {
                name: {
                    message: ''
                }
            },
            name: '',
            message: ''
        }, mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockResponse.status).toBeCalledWith(status);
    });

    test('with 200 status code', async () => {
        const status: number = 200;
        addErrorHandler({
            status,
            success: false,
            fields: {
                name: {
                    message: ''
                }
            },
            name: '',
            message: ''
        }, mockRequest as Request, mockResponse as Response, nextFunction);

        expect(mockResponse.status).toBeCalledWith(status);
    });

})