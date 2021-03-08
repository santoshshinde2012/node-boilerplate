import * as express from 'express';
import {
    StatusCodes,
} from 'http-status-codes';
import * as qs from "querystring";
import { AuthController } from './AuthController';
import * as ResponseHandler from "../../helpers/response.handler";
import * as envHandler from "../../helpers/environment.handler";

export function authRoutes(app: express.Express, router: any) : any {

    const login = (request: any, response: any, next: any) => {
        const query: string = qs.stringify({
            response_type: 'code',
            client_id: envHandler.envKeyclockRealmClientId(),
            redirect_uri: envHandler.envRedirectURI()
        });
        const host: any = `${envHandler.envKeyclockServer()}/auth/realms/${envHandler.envKeyclockRealmClientId()}/protocol/openid-connect/auth?${query}`;
        response.redirect(host);
    }

    const auth = async (request: any, response: express.Response, next: any) => {
        try {
            const controller: AuthController = new AuthController();
            const result: any = await controller.getAccessToken(request.query.code);
            request.session.tokenInfo = result.data;
            response.redirect("/auth/user");
        } catch (err) {
            response.locals.errorCode = StatusCodes.UNAUTHORIZED;
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }

    const user = (request: any, response: any, next: any) => {
        try {
            const controller: AuthController = new AuthController();
            const { host, userName, name, email, role } : any = controller.getUserInfo(request.session);
            response.render("login_success", {
                host,
                message: 'Suceess',
                data : {
                    userName,
                    name,
                    email,
                    role
                },
            });
        } catch (err) {
            response.locals.errors = err.message;
            response.locals.error = err;
            ResponseHandler.JSONERROR(request, response);
        }
    }

    app.get('/login', login);
    router.get('/', auth);
    router.get('/user', user);
}
