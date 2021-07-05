enum Environments {
    LOCAL = 'local',
    PRODUCTION = 'production',
    DEV = 'dev',
    TEST = 'test',
    QA = 'qa',
    STAGING = 'staging',
}

enum EnvironmentFile {
    LOCAL = '.env',
    PRODUCTION = '.env.prod',
    DEV = '.env',
    TEST = '.env.test',
    QA = '.env.stag',
    STAGING = '.env.stag',
}

export {
  Environments,
  EnvironmentFile,
};
