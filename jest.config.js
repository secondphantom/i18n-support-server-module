/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // setupFiles: ["dotenv/config"],
  // setupFilesAfterEnv: ["./src/setupTestsAfterEnv.ts"],
  testMatch: ["<rootDir>/src/tests/**/*"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
  },
};
