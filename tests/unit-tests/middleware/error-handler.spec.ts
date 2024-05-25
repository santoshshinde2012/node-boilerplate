import 'jest';
import { NextFunction, Request, Response } from 'express';
import addErrorHandler from '../../../src/middleware/error-handler';
import { StatusCodes } from 'http-status-codes';

describe('ErrorHandler middleware', () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let nextFunction: NextFunction = jest.fn();

	beforeEach(() => {
		mockRequest = {};
		mockResponse = {
			status: jest.fn(),
			send: jest.fn(),
		};
	});

	test('with 0 status code', async () => {
		const status: number = StatusCodes.INTERNAL_SERVER_ERROR;
		addErrorHandler(
			{
				status: 0,
				success: false,
				fields: {
					name: {
						message: '',
					},
				},
				name: '',
				message: '',
			},
			mockRequest as Request,
			mockResponse as Response,
			nextFunction,
		);

		expect(mockResponse.status).toHaveBeenCalledWith(status);
	});

	test('with 200 status code', async () => {
		const status: number = 200;
		addErrorHandler(
			{
				status,
				success: false,
				fields: {
					name: {
						message: '',
					},
				},
				name: '',
				message: '',
			},
			mockRequest as Request,
			mockResponse as Response,
			nextFunction,
		);

		expect(mockResponse.status).toHaveBeenCalledWith(status);
	});

	test('with 200 status code', async () => {
		const status: number = 200;
		addErrorHandler(
			{
				status,
				success: false,
				fields: {
					name: {
						message: '',
					},
				},
				name: '',
				message: '',
			},
			mockRequest as Request,
			mockResponse as Response,
			nextFunction,
		);

		expect(mockResponse.status).toHaveBeenCalledWith(status);
	});

	test('with 200 status code and updated env variables', async () => {
		process.env.APPLY_ENCRYPTION = 'true';
		process.env.SECRET_KEY = 'key';
		const status: number = 200;
		addErrorHandler(
			{
				status,
				success: false,
				fields: {
					name: {
						message: '',
					},
				},
				name: '',
				message: '',
			},
			mockRequest as Request,
			mockResponse as Response,
			nextFunction,
		);

		expect(mockResponse.status).toHaveBeenCalledWith(status);
	});
});
