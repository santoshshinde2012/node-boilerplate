module.exports = {
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
  testResultsProcessor: "jest-sonar-reporter",
  setupFiles: ['dotenv/config'],
};