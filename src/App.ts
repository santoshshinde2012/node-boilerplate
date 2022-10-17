import cors from 'cors';
import express from 'express';
import http from 'http';
import helmet from 'helmet';
import * as path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json'
import registerRoutes from './routes';
import addErrorHandler from './middleware/error-handler';

export default class App {
    public express: express.Application;

    public httpServer: http.Server;

    public async init(): Promise<void> {
        this.express = express();
        this.httpServer = http.createServer(this.express);
        this.middleware();
        this.routes();
        this.addErrorHandler();
        // In a development environment, Swagger will be enabled.
        if(environment.isDevEnvironment()) {
            this.setupSwaggerDocs();
        }
    }

    /**
     * here register your all routes
     */
    private routes(): void {
        this.express.get('/', this.basePathRoute);
        this.express.get('/web', this.parseRequestHeader, this.basePathRoute);
        registerRoutes(this.express);
    }

    /**
     * here you can apply your middlewares
     */
    private middleware(): void {
        // support application/json type post data
        // support application/x-www-form-urlencoded post data
        // Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
        this.express.use(helmet({ contentSecurityPolicy: false }));
        this.express.use(express.json({ limit: '100mb' }));
        this.express.use(express.urlencoded({ limit: '100mb', extended: true }));
        // add multiple cors options as per your use
        const corsOptions = {
            origin: ['http://localhost:8080/', 'http://example.com/', 'http://127.0.0.1:3146'],
        };
        this.express.use(cors(corsOptions));
    }

    private parseRequestHeader(req: express.Request, res: express.Response, next: Function): void {
        // parse request header
        // console.log(req.headers.access_token);
        next();
    }

    private basePathRoute(request: express.Request, response: express.Response): void {
        response.json({ message : 'base path' });
    }

    private addErrorHandler(): void {
        this.express.use(addErrorHandler);
    }

    private setupSwaggerDocs(): void {
        this.express.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }
}
