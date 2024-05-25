import * as express from 'express';
import App from '../../src/App';
import logger from '../../src/lib/logger';

export default class IntegrationHelpers {
	private static appInstance: express.Application;

	public static async getApp(): Promise<express.Application> {
		if (this.appInstance) {
			return this.appInstance;
		}
		const app: App = new App();
		await app.init();
		this.appInstance = app.express;

		return this.appInstance;
	}

	public clearDatabase(): void {
		logger.info('clear the database');
	}
}
