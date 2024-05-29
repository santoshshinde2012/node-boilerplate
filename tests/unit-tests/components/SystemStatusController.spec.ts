import { NextFunction, Request, Response } from 'express';
import SystemStatusController from '../../../src/components/system-status/SystemStatusController';
import BaseController from '../../../src/components/BaseController';
import * as crypto from '../../../src/lib/crypto';

describe('System Status Controller', () => {
	let request: Partial<Request>;
	let response: Partial<Response>;
	let next: NextFunction = jest.fn();
	let controller: SystemStatusController;

	beforeAll(() => {
		controller = new SystemStatusController();
	});

	beforeEach(() => {
		request = {};
		response = {
			locals: {},
			status: jest.fn(),
			send: jest.fn(),
		};
	});

	test('test getError method', () => {
		controller.getError(request as Request, response as Response, next);
		expect(next).toHaveBeenCalled();
	});

	test('test getSystemInfo method', () => {
		controller.getSystemInfo(
			request as Request,
			response as Response,
			next,
		);
		const locals = response.locals;
		expect(locals?.data).toHaveProperty('os');
	});

	test('test getSystemInfo method with updated env variables', () => {
		process.env.APPLY_ENCRYPTION = 'true';
		process.env.SECRET_KEY = 'key';
		const mockEncrypt = jest.spyOn(crypto, 'encrypt');
		controller.getSystemInfo(
			request as Request,
			response as Response,
			next,
		);
		expect(mockEncrypt).toHaveBeenCalled();
	});

	test('test getSystemInfo method with exception', () => {
		jest.spyOn(BaseController.prototype, 'send').mockImplementation(() => {
			throw new Error('exception');
		});
		controller.getSystemInfo(
			request as Request,
			response as Response,
			next,
		);
		expect(next).toHaveBeenCalled();
	});

	test('test getServerTime method', () => {
		controller.getServerTime(
			request as Request,
			response as Response,
			next,
		);
		const locals = response.locals;
		expect(locals?.data).toHaveProperty('date');
		expect(locals?.data).toHaveProperty('utc');
	});

	test('test getServerTime method with exception', () => {
		jest.spyOn(BaseController.prototype, 'send').mockImplementation(() => {
			throw new Error('exception');
		});
		controller.getServerTime(
			request as Request,
			response as Response,
			next,
		);
		expect(next).toHaveBeenCalled();
	});

	test('test getResourceUsage method', () => {
		controller.getResourceUsage(
			request as Request,
			response as Response,
			next,
		);
		const locals = response.locals;
		expect(locals?.data).toHaveProperty('processMemory');
		expect(locals?.data).toHaveProperty('systemMemory');
	});

	test('test getResourceUsage method with exception', () => {
		jest.spyOn(BaseController.prototype, 'send').mockImplementation(() => {
			throw new Error('exception');
		});
		controller.getResourceUsage(
			request as Request,
			response as Response,
			next,
		);
		expect(next).toHaveBeenCalled();
	});

	test('test getProcessInfo method', () => {
		controller.getProcessInfo(
			request as Request,
			response as Response,
			next,
		);
		const locals = response.locals;
		expect(locals?.data).toHaveProperty('applicationVersion');
		expect(locals?.data).toHaveProperty('nodeDependencyVersions');
	});

	test('test getProcessInfo method with exception', () => {
		jest.spyOn(BaseController.prototype, 'send').mockImplementation(() => {
			throw new Error('exception');
		});
		controller.getProcessInfo(
			request as Request,
			response as Response,
			next,
		);
		expect(next).toHaveBeenCalled();
	});
});
