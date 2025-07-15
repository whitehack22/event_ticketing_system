import type {Config} from 'jest';

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    "/node_modules",
    "src/Drizzle/db.ts",
    "src/Drizzle/schema.ts",
    "src/mailer/mailer.ts",
  ]
};

export default config;