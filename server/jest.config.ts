// jest.config.ts
import { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node", // use "jsdom" if testing frontend
  moduleFileExtensions: ["ts", "js", "json"],
  roots: ["<rootDir>/src"], // where your code lives
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
  clearMocks: true,
};

export default config;
