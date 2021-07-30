import 'jest';
import * as express from 'express';
import * as request from 'supertest';
import {
    StatusCodes,
} from 'http-status-codes';
import IntegrationHelpers from '../helpers/Integration-helpers';

describe('status integration tests', () => {
    let app: express.Application;

    beforeAll(async() => {
        app = await IntegrationHelpers.getApp();
    });


    it('can get server time', async () => {
        await request(app)
            .get('/api/status/time')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect((res: request.Response) => {
                // eslint-disable-next-line no-console
                console.log(res.text);
            })
            .expect(StatusCodes.OK);
    });

    it('can get server system info', async () => {
        await request(app)
            .get('/api/status/system')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(StatusCodes.OK);
    });

    it('can get server system usage', async () => {
        await request(app)
            .get('/api/status/usage')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(StatusCodes.OK);
    });

    it('can get server system process info', async () => {
        await request(app)
            .get('/api/status/process')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(StatusCodes.OK);
    });

    it('should get the error', async () => {
        await request(app)
            .get('/api/status/error')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(StatusCodes.BAD_REQUEST);
    });

});
