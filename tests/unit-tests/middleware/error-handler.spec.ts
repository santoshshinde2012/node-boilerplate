import 'jest';
import { NextFunction, Request, Response } from 'express';
import addErrorHandler from '../../../src/middleware/error-handler';
import { StatusCodes } from 'http-status-codes';

describe('ErrorHandler middleware', () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	const nextFunction: NextFunction = jest.fn();
	let statusMock: jest.Mock;
	let jsonMock: jest.Mock;

	beforeEach(() => {
		mockRequest = { headers: {}, method: 'GET', originalUrl: '/' };
		jsonMock = jest.fn();
		statusMock = jest.fn().mockReturnValue({ json: jsonMock });
		mockResponse = {
			status: statusMock,
			json: jsonMock,
			headersSent: false,
		};
	});

	test('with 0 status code falls back to 500', () => {
		addErrorHandler(
			{
				status: 0,
				success: false,
				fields: { name: { message: '' } },
				name: '',
				message: '',
			} as never,
			mockRequest as Request,
			mockResponse as Response,
			nextFunction,
		);
		expect(statusMock).toHaveBeenCalledWith(
			StatusCodes.INTERNAL_SERVER_ERROR,
		);
		expect(jsonMock).toHaveBeenCalled();
	});

	test('with 200 status code passes through', () => {
		const status = 200;
		addErrorHandler(
			{
				status,
				success: false,
				fields: { name: { message: '' } },
				name: '',
				message: '',
			} as never,
			mockRequest as Request,
			mockResponse as Response,
			nextFunction,
		);
		expect(statusMock).toHaveBeenCalledWith(status);
		expect(jsonMock).toHaveBeenCalled();
	});

	test('with custom 422 status code', () => {
		const status = 422;
		addErrorHandler(
			{
				status,
				success: false,
				name: 'ValidationError',
				message: 'Invalid input',
			} as never,
			mockRequest as Request,
			mockResponse as Response,
			nextFunction,
		);
		expect(statusMock).toHaveBeenCalledWith(status);
	});

	test('skips when headers already sent', () => {
		(mockResponse as { headersSent: boolean }).headersSent = true;
		addErrorHandler(
			{
				status: 500,
				success: false,
				name: 'Boom',
				message: 'late',
			} as never,
			mockRequest as Request,
			mockResponse as Response,
			nextFunction,
		);
		expect(statusMock).not.toHaveBeenCalled();
		expect(jsonMock).not.toHaveBeenCalled();
	});

	test('no-op when error is nullish', () => {
		addErrorHandler(
			null,
			mockRequest as Request,
			mockResponse as Response,
			nextFunction,
		);
		expect(statusMock).not.toHaveBeenCalled();
	});

	test('still runs with encryption env vars set', () => {
		process.env.APPLY_ENCRYPTION = 'true';
		process.env.SECRET_KEY = 'key';
		const status = 200;
		addErrorHandler(
			{
				status,
				success: false,
				name: '',
				message: '',
			} as never,
			mockRequest as Request,
			mockResponse as Response,
			nextFunction,
		);
		expect(statusMock).toHaveBeenCalledWith(status);
	});
});
