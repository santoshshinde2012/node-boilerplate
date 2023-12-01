import { Sequelize } from 'sequelize-typescript';
import environment from '../environment';
import models from '../models';


const {
    dbName,
    dbHost,
    dbUser,
    dbPassword,
    dbPort,
} = environment;

const sequelizeConnection = new Sequelize(
    dbName,
    dbUser,
    dbPassword,
    {
        models,
        host: dbHost,
        dialect: 'postgres',
        port: dbPort,
    }
)

export default sequelizeConnection;
