import { Application, Router } from 'express';

/**
 * Provides services common to all API methods
 */
export default abstract class BaseApi {
    protected router: Router;

    protected constructor() {
      this.router = Router();
    }

    public abstract register(express: Application): void;
}
