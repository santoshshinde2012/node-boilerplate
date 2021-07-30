import * as fs from 'fs';
import { config as configDotenv } from 'dotenv';
import * as path from 'path';
import { EnvironmentFile, Environments } from './environment.constant';

class Environment {
    public port: number;

    public connectionUrl: string;

    constructor(env?: string) {
      this.setEnvironment(env);
      const port: string | undefined | number = process.env.PORT || 3146;
      this.port = Number(port);
      if (process.env.connectionUrl) {
        this.connectionUrl = process.env.connectionUrl;
      }
    }

    public currentEnvironment(): string {
      let environment: string = process.env.NODE_ENV || Environments.DEV;

      if (!environment) {
        environment = Environments.LOCAL;
      }
      switch (environment) {
        case Environments.PRODUCTION:
          return Environments.PRODUCTION;
        case Environments.DEV:
        case Environments.TEST:
        case Environments.QA:
          return Environments.TEST;
        case Environments.STAGING:
          return Environments.STAGING;
        case Environments.LOCAL:
        default:
          return Environments.LOCAL;
      }
    }

    public isProduction(): boolean {
      return this.currentEnvironment() === Environments.PRODUCTION;
    }

    public getDatabaseConnectionURL(): string {
      return '';
    }

    public setEnvironment(env: string): void {
      let envPath: string;
      const rootdir : string = path.resolve(__dirname, '../../');
      switch (env) {
        case Environments.PRODUCTION:
          envPath = path.resolve(rootdir, EnvironmentFile.PRODUCTION);
          break;
        case Environments.TEST:
          envPath = path.resolve(rootdir, EnvironmentFile.TEST);
          break;
        case Environments.STAGING:
          envPath = path.resolve(rootdir, EnvironmentFile.STAGING);
          break;
        case Environments.LOCAL:
          envPath = path.resolve(rootdir, EnvironmentFile.LOCAL);
          break;
        default:
          envPath = path.resolve(rootdir, EnvironmentFile.LOCAL);
      }
      if (!fs.existsSync(envPath)) {
        throw new Error('.env file is missing in root directory');
      }
      configDotenv({ path: envPath });
    }
}

export default Environment;
