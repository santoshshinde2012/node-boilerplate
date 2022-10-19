import 'jest';
import { Environments } from '../../../src/environments/environment.constant';
import Environment from '../../../src/environments/environment';

describe('Environment', () => {

    let instance: Environment;

        it('should get the current environment', async () => {
            instance = new Environment();
            expect(instance).toBeInstanceOf(Environment);
            const environment = instance.getCurrentEnvironment();
            expect(environment).toBeDefined();
            expect(environment).toBe(Environments.TEST);
        });

        it('should check if environement is production or not', async () => {
            instance = new Environment();
            const result = instance.isProductionEnvironment();
            expect(result).toBe(false);
        });

        it('should check if environement is dev or not', async () => {
            instance = new Environment();
            const result = instance.isDevEnvironment();
            expect(result).toBe(false);
        });

        it('should check if environement is staging or not', async () => {
            instance = new Environment();
            const result = instance.isStagingEnvironment();
            expect(result).toBe(false);
        });

        it('should check if environement is test or not', async () => {
            instance = new Environment();
            const result = instance.isTestEnvironment();
            expect(result).toBe(true);
        });

        it('should set the local as current environment', async () => {
            const env: Environment = new Environment(Environments.LOCAL);
            env.setEnvironment('local');
            const environment = env.getCurrentEnvironment();
            expect(environment).toBeDefined();
            expect(environment).toBe(Environments.LOCAL);
        });

        it('should set the production as current environment', async () => {
            const env: Environment = new Environment();
            try {
                env.setEnvironment(Environments.PRODUCTION);
            } catch (e) {
                const environment = env.getCurrentEnvironment();
                expect(environment).toBeDefined();
                expect(environment).toBe(Environments.PRODUCTION);
            }
        });

        it('should set the staging as current environment', async () => {
            const env: Environment = new Environment();
            try {
                env.setEnvironment(Environments.STAGING);
            } catch (e) {
                const environment = env.getCurrentEnvironment();
                expect(environment).toBeDefined();
                expect(environment).toBe(Environments.STAGING);
            }
        });

        it('should set the local as default environment', async () => {
            process.env.NODE_ENV = ''
            process.env.PORT = ''
            const env: Environment = new Environment();
            env.setEnvironment('');
            const environment = env.getCurrentEnvironment();
            expect(environment).toBeDefined();
            expect(environment).toBe(Environments.LOCAL);
        });
});