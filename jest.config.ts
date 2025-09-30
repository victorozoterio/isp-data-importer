import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s', '!src/**/*.d.ts', '!src/main.ts', '!src/migrations/**'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 10000,
  transformIgnorePatterns: ['node_modules/(?!(@nestjs|@swc)/)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
