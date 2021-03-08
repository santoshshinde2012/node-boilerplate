/**
 * Keyclock controller
 */
import * as qs from "querystring";
import axios from "axios";
import jwt_decode from "jwt-decode";
import * as envHandler from "../../helpers/environment.handler";

export class AuthController {
    /**
     * 
     * @param code 
     */
    public async getAccessToken(code: string): Promise<any> {
        try {
            const tokenUrl: string = `${envHandler.envKeyclockServer()}/auth/realms/${envHandler.envKeyclockRealmClientId()}/protocol/openid-connect/token`;
            const params: string = qs.stringify({
                grant_type: 'authorization_code',
                client_id: envHandler.envKeyclockRealmClientId(),
                client_secret: envHandler.envKeyclockRealmCClientSecret(),
                code,
                redirect_uri: envHandler.envRedirectURI(),
            });
            const headers: any  = {
                headers: {
                  "content-type": "application/x-www-form-urlencoded;charset=utf-8",
                },
            };
            const response = await axios.post(tokenUrl, params, headers);
            return {
                data : response.data
            };
        } catch (err) {
            throw(err)
        }
    }

    public getUserInfo({ tokenInfo }): any {
        try {
            const { access_token } = tokenInfo;
            console.log(access_token);
            const { realm_access, preferred_username, name, email  }: any = jwt_decode(access_token);
            let role = [];
            if(realm_access.roles) {
              role = realm_access.roles;
            }
            const query = qs.stringify({
              redirect_uri: envHandler.envRedirectHostURI()
            });
           
            const data = {
              userName: preferred_username,
              name,
              email,
              role,
              host: `${envHandler.envKeyclockServer()}/auth/realms/${envHandler.envKeyclockRealmClientId()}/protocol/openid-connect/logout?${query}`,
            };
            return data;
        } catch(err) {
            throw(err);
        }
    }
}
