import * as express from 'express';
import App from '../../src/App';
import Environment from '../../src/environments/environment';
import logger from '../../src/lib/logger';

export default class IntegrationHelpers {

    public static appInstance: express.Application;

    public static async getApp(): Promise<express.Application> {
        if (this.appInstance) {
            return this.appInstance;
        }
        const env: Environment = new Environment(process.env.NODE_ENV);
        const app: App = new App(env);
        await app.init();
        this.appInstance = app.express;

        return this.appInstance;
    }

    public clearDatabase(): void {
        logger.info('clear the database');
    }

}


