require('ts-node/register');

require('./src/database/umzug').migrator.runAsCLI();