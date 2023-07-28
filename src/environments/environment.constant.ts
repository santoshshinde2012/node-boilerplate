enum Environments {
	LOCAL = 'local',
	PRODUCTION = 'production',
	DEV = 'dev',
	TEST = 'test',
	STAGING = 'staging',
}

enum EnvironmentFile {
	LOCAL = '.env',
	PRODUCTION = '.env.prod',
	DEV = '.env',
	TEST = '.env.test',
	STAGING = '.env.stag',
}

export { Environments, EnvironmentFile };
