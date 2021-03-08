import getConfiguration from '../environments/environment';

/**
 * Get Host
 */
export const envHost = () => getConfiguration().HOST;

/**
 * Get port
 */
export const envPort = () => getConfiguration().PORT;

/**
 * Get client id
 */
export const envKeyclockRealmClientId = () => getConfiguration().CLIENT_ID;

/**
 * Get client secret
 */
export const envKeyclockRealmCClientSecret = () => getConfiguration().CLIENT_SECRET;

/**
 * Get redirect uri
 */
export const envRedirectURI = () => getConfiguration().REDIRECT_URI;

/**
 * Get  hoSTredirect uri
 */
export const envRedirectHostURI = () => getConfiguration().REDIRECT_HOST_URI;



/**
 * Get keyclock server
 */
export const envKeyclockServer = () => getConfiguration().KEYCLOCK_SERVER;

/**
 * Get keyclock realms name
 */
export const envKeyclockRealmName = () => getConfiguration().KEYCLOCK_REALMS_Name;

/**
 * Get keyclock Admin user
 */
export const envKeyclockAdmin = () => getConfiguration().KEYCLOCK_ADMIN;
