import { Router } from 'express';
import SystemStatusController from './components/system-status/SystemStatusController';
import BaseController from './components/BaseController';
import { RouteDefinition } from './types/RouteDefinition';
import logger from './lib/logger';
import config from './config';

function registerControllerRoutes(routes: RouteDefinition[]): Router {
	const controllerRouter = Router();
	routes.forEach((route) => {
		switch (route.method) {
			case 'get':
				controllerRouter.get(route.path, route.handler);
				break;
			case 'post':
				controllerRouter.post(route.path, route.handler);
				break;
			case 'put':
				controllerRouter.put(route.path, route.handler);
				break;
			case 'patch':
				controllerRouter.patch(route.path, route.handler);
				break;
			case 'delete':
				controllerRouter.delete(route.path, route.handler);
				break;
			default:
				throw new Error(`Unsupported HTTP method: ${route.method}`);
		}
	});
	return controllerRouter;
}

interface ControllerLike extends BaseController {
	basePath: string;
}

/**
 * Register all controller-backed routes under /v1.
 * Returns an empty router on registration failure so the app can still boot.
 */
export default function registerRoutes(): Router {
	const router = Router();

	try {
		const controllers: ControllerLike[] = [];

		if (config.exposeSystemRoutes) {
			controllers.push(new SystemStatusController());
		}

		controllers.forEach((controller) => {
			router.use(
				`/v1/${controller.basePath}`,
				registerControllerRoutes(controller.routes()),
			);
		});
	} catch (error) {
		logger.error('Unable to register the routes:', error);
	}

	return router;
}
