import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    roots: [
        "./tests"
    ],
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/tests/"
    ],
    collectCoverage: true,
    testEnvironment: 'node',
    reporters: ['default', ['jest-to-sonar', {
        outputFile: './coverage/sonar-report.xml',
    }]],
    setupFiles: ['dotenv/config'],
};

export default config;