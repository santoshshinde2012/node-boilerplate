// istanbul ignore file
import * as http from 'http';
import { AddressInfo } from 'net';
import * as logger from 'winston';
import { TransformableInfo } from '../node_modules/logform';
import { App } from './App';

const port: string | undefined | number = process.env.PORT || 3146;
export const app: App = new App();
export let server: http.Server;

logger.configure({
    level: 'debug',
    transports: [
        new logger.transports.Console({
            format: logger.format.combine(
                logger.format.colorize(),
                logger.format.timestamp(),
                logger.format.align(),
                logger.format.printf((info: TransformableInfo) => `${info.timestamp} ${info.level}: ${info.message}`),
            ),
        }),
    ],
});

app.init().then(() => {
    app.express.set('port', port);

    server = app.httpServer; //http.createServer(App);
    server.on('error', serverError);
    server.on('listening', serverListening);
    server.listen(port);
}).catch((err: Error) => {
    logger.info('app.init error');
    logger.error(err.name);
    logger.error(err.message);
    logger.error(err.stack);
    process.exit(1);
});

function serverError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') {
        throw error;
    }
    //handle specific error codes here.
    throw error;
}

function serverListening(): void {
    const addressInfo: AddressInfo = <AddressInfo>server.address();
    logger.info(`Listening on ${addressInfo.address}:${port}`);
}

process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled Promise Rejection: reason:', reason.message);
    logger.error(reason.stack);
    // application specific logging, throwing an error, or other logic here
});
