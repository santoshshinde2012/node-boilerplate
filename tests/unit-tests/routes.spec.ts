import SystemStatusController from '../../src/components/system-status/SystemStatusController';
import logger from '../../src/lib/logger';
import registerRoutes from '../../src/routes';

jest.mock('../../src/components/system-status/SystemStatusController', () => ({
	__esModule: true,
	default: jest.fn().mockImplementation(() => ({
		basePath: 'system-status',
		routes: jest.fn().mockReturnValue([
			{ method: 'get', path: '/test-get', handler: jest.fn() },
			{ method: 'post', path: '/test-post', handler: jest.fn() },
			{ method: 'put', path: '/test-put', handler: jest.fn() },
			{ method: 'patch', path: '/test-patch', handler: jest.fn() },
			{ method: 'delete', path: '/test-delete', handler: jest.fn() },
		]),
	})),
}));

jest.mock('../../src/lib/logger', () => ({
	info: jest.fn(),
	error: jest.fn(),
}));

describe('registerRoutes', () => {
	it('should register routes for each controller', () => {
		registerRoutes();

		// Assert that controller routes are registered
		expect(SystemStatusController).toHaveBeenCalledTimes(1);
	});

	it('should register routes for each controller error', () => {
		const mockGetHandler = jest.fn();
		(SystemStatusController as jest.Mock).mockImplementationOnce(() => ({
			basePath: 'system-status',
			routes: () => [
				{
					method: 'option',
					path: '/test-option',
					handler: mockGetHandler,
				},
			],
		}));

		const error = new Error('Unsupported HTTP method: option');

		registerRoutes();

		expect(logger.error).toHaveBeenCalledWith(
			'Unable to register the routes:',
			error,
		);
	});
});
