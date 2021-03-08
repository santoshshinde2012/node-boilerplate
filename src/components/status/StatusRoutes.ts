import * as express from 'express';
import { StatusController } from './StatusController';

export function statusRoutes(app: express.Express, router: any) : any {
    router.get('/time', (request: any, response: any, next: any) => {
        try {
            const controller: StatusController = new StatusController();
            const data: any = controller.getServerTime();
            response.status(200).json(data);
        } catch (err) {
            response.status(204).end();
        }
    });
}
