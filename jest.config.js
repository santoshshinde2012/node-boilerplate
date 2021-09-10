module.exports = {
  preset: 'ts-jest',
  roots: [
    "./tests"
  ],
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
};