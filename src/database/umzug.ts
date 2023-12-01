import { Sequelize } from 'sequelize-typescript';
import { Umzug, SequelizeStorage } from 'umzug';
import Environment from '../environments/environment';

const { dbName, dbUser, dbPassword, dbHost } = new Environment();

console.log(dbName);

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
	host: dbHost,
	dialect: 'postgres',
});

export const migrationsParentDirectory = __dirname;

export const migrator = new Umzug({
	migrations: {
		glob: ['migrations/*.ts', { cwd: migrationsParentDirectory }],
	},
	context: sequelize,
	storage: new SequelizeStorage({
		sequelize,
	}),
	logger: console,
});

export type Migration = typeof migrator._types.migration;
