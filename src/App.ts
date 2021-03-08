import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as session from "express-session";
import { registerRoutes } from './routes';

/**
 * Main application class
 */
export class App {
    public express: express.Express;
    public httpServer: http.Server;

    public async init(environment?: string): Promise<void> {
        this.express = express();
        this.httpServer = http.createServer(this.express);
        this.express.use(this.setupCors);
        // Set EJS as templating engine
        this.express.set("view engine", "ejs");

        this.setupMiddleware();
        registerRoutes(this.express);
    }

    private setupMiddleware(): void {
        const memoryStore = new session.MemoryStore();
        const sessionObj = {
            secret: "mySecret",
            resave: false,
            saveUninitialized: true,
            store: memoryStore,
        };
        this.express.use(session(sessionObj));
        this.express.use(bodyParser.urlencoded({extended: true}));
        this.express.use(bodyParser.json());
        this.express.use(express.static("public"));
        this.express.use(express.static(path.join(__dirname, 'public')))
    }

    private setupCors(req: express.Request, res: express.Response, next: express.NextFunction): void {
        let origin: string = req.header('Origin');
        if (!origin) {
            origin = '*';
        }
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }

    }
}
