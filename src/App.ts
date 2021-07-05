import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as helmet from 'helmet';
import registerRoutes from './routes';
import Environment from './environments/environment';
import addErrorHandler from './middleware/error-handler';

export default class App {
    public express: express.Application;

    public httpServer: http.Server;

    public env : Environment;

    constructor(env: Environment) {
        this.env = env;
    }

    public async init(): Promise<void> {
        this.express = express();
        this.httpServer = http.createServer(this.express);
        this.middleware();
        this.routes();
        this.addErrorHandler();
    }

    /**
     * here register your all routes
     */
    private routes(): void {
        this.express.get('/', this.basePathRoute);
        registerRoutes(this.express);
    }

    /**
     * here you can apply your middlewares
     */
    private middleware(): void {
        // support application/json type post data
        // support application/x-www-form-urlencoded post data
        // Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
        this.express.use(helmet());
        this.express.use(express.json({ limit: '100mb' }));
        this.express.use(express.urlencoded({ limit: '100mb', extended: true }));
        this.express.use(cors());
    }

    private basePathRoute(request: express.Request, response: express.Response): void {
        response.json({ message : 'base path' });
    }

    private addErrorHandler(): void {
        this.express.use(addErrorHandler);
    }
}
