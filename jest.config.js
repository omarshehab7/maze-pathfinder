const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "jsdom", // ✅ needed for DOM APIs in React
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    // ✅ resolve @/components/* aliases
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // ✅ for jest-dom
};