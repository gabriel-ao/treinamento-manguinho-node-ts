/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/presentation/protocols/', // Ignora essa pasta
    '/presentation/controllers/signup/signup-protocols.ts', // Ignora este arquivo específico
    '/data/usecases/add-account/db-add-account-protocols.ts', // Ignora este arquivo específico
  ],
  // testEnvironment: "jest-environment-node", original
};

module.exports = config;
