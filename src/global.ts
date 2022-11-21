/* eslint-disable vars-on-top */
import Environment from './environments/environment';

declare global {
	// eslint-disable-next-line no-var
	var environment: Environment;
}

export const setGlobalEnvironment = (environment: Environment): void => {
	global.environment = environment;
};
