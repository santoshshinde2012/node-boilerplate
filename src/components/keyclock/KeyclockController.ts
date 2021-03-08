/**
 * Keyclock controller
 */
import * as qs from "querystring";
import axios from "axios";
import * as HttpStatus from "http-status-codes";
import jwt_decode from "jwt-decode";
import KcAdminClient from 'keycloak-admin';
import * as envHandler from "../../helpers/environment.handler";

export class KeyclockController {

    private kcAdminClient: KcAdminClient;

    constructor() {
        this.kcAdminClient = new KcAdminClient(
            {
                baseUrl: `${envHandler.envKeyclockServer()}/auth`
            }
        );
       
    }

    private async init(): Promise<void> {
        // Authorize with username / password
        await this.kcAdminClient.auth({
            username: envHandler.envKeyclockAdmin().USER_NAME,
            password: envHandler.envKeyclockAdmin().PASSWORD,
            grantType: 'password',
            clientId: 'admin-cli',
        });

        this.kcAdminClient.setConfig({
            realmName: 'iifl',
        });
    }

    public async getUsers(): Promise<any> {
        try {
           
            await this.init();

            // List all users
            const users = await this.kcAdminClient.users.find();

            return users;

        } catch(err) {
            throw(err)
        }
    }

    public async getGroups(): Promise<any> {
        try {
           
            await this.init();

            // List all users
            const groups = await this.kcAdminClient.groups.find();

            return groups;

        } catch(err) {
            throw(err)
        }
    }

    public async createUser(): Promise<any> {
        try {
          
        } catch (err) {
            throw(err)
        }
    }
}
