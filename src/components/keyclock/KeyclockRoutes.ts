import * as express from 'express';
import {
    StatusCodes,
} from 'http-status-codes';
import { KeyclockController } from './KeyclockController';
import * as ResponseHandler from "../../helpers/response.handler";

export function keyClockRoutes(app: express.Express, router: any) : any {

    const getUsers = async (request: any, response: any, next: any) => {
        try {
            const controller: KeyclockController = new KeyclockController();
            const users : any = await controller.getUsers();
            response.locals.data = users;
            ResponseHandler.JSONSUCCESS(request, response);
        } catch (err) {
            console.log(JSON.stringify(err));
            response.locals.errors = err.message;
            ResponseHandler.JSONERROR(request, response);
        }
    }

    const getGroups = async (request: any, response: any, next: any) => {
        try {
            const controller: KeyclockController = new KeyclockController();
            const groups : any = await controller.getGroups();
            response.locals.data = groups;
            ResponseHandler.JSONSUCCESS(request, response);
        } catch (err) {
            console.log(JSON.stringify(err));
            response.locals.errors = err.message;
            ResponseHandler.JSONERROR(request, response);
        }
    }

    router.get('/users', getUsers);
    router.get('/groups', getGroups);
}
