import * as express from 'express';
import {
    StatusCodes,
} from 'http-status-codes';
import * as util from "util";
import { RecordRtcController } from './RecordRtcController';
import * as ResponseHandler from "../../helpers/response.handler";

export function recordRtcRoutes(app: express.Express, router: any) : any {

    const upload = async (request: any, response: any, next: any) => {
        try {
            const controller: RecordRtcController = new RecordRtcController();
            const fileURL = await controller.uploadFile(request);
            console.log('fileURL: ', fileURL);
            response.writeHead(200);
            response.write(JSON.stringify({
                fileURL: fileURL
            }));
            response.end();
            // response.locals.data = '';
            // ResponseHandler.JSONSUCCESS(request, response);
        } catch (err) {
            console.log(JSON.stringify(err));
            response.locals.errors = err.message;
            ResponseHandler.JSONERROR(request, response);
        }
    }
    router.post('/upload', upload);
}
