enum Environments {
	LOCAL = 'local',
	PRODUCTION = 'production',
	TEST = 'test',
	STAGING = 'staging',
}

enum EnvironmentFile {
	LOCAL = '.env.local',
	PRODUCTION = '.env.prod',
	TEST = '.env.test',
	STAGING = '.env.stag',
}

export { Environments, EnvironmentFile };
