import 'jest';
import express from 'express';
import request from 'supertest';
import {
    StatusCodes,
} from 'http-status-codes';
import IntegrationHelpers from '../helpers/Integration-helpers';

describe('status integration tests', () => {
    let app: express.Application;
    const contentType: string = process.env.APPLY_ENCRYPTION && process.env.SECRET_KEY ? 'text/html; charset=utf-8' : 'application/json; charset=utf-8';

    beforeAll(async() => {
        app = await IntegrationHelpers.getApp();
    });


    it('can get server time', async () => {
        await request(app)
            .get('/system/time')
            .set('Accept', 'application/json')
            .expect('Content-Type', contentType)
            .expect(StatusCodes.OK);
    });

    it('can get server system info', async () => {
        await request(app)
            .get('/system/info')
            .set('Accept', 'application/json')
            .expect('Content-Type', contentType)
            .expect(StatusCodes.OK);
    });

    it('can get server system usage', async () => {
        await request(app)
            .get('/system/usage')
            .set('Accept', 'application/json')
            .expect('Content-Type', contentType)
            .expect(StatusCodes.OK);
    });

    it('can get server system process info', async () => {
        await request(app)
            .get('/system/process')
            .set('Accept', 'application/json')
            .expect('Content-Type', contentType)
            .expect(StatusCodes.OK);
    });

    it('should get the error', async () => {
        await request(app)
            .get('/system/error')
            .set('Accept', 'application/json')
            .expect('Content-Type', contentType)
            .expect(StatusCodes.BAD_REQUEST);
    });

});
