import * as express from 'express';
import SystemStatusController from './components/system-status/system-status.controller';

/**
 * Here, you can register routes by instantiating the controller.
 * @param app 
 */
export default function registerRoutes(app: express.Application): void {
    // System Status Controller
    const systemStatusController: SystemStatusController = new SystemStatusController('/api/status');
    systemStatusController.register(app)
}
