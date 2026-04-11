const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['/node_modules/', 'tests/units/src/mocks'],
  testMatch: ['<rootDir>/tests/**/*.unit.spec.{js,ts,tsx,jsx}'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: process.env.JEST_RESULT_OUTPUT_DIR || './_devops/test',
      },
    ],
    [
      'jest-sonar',
      {
        outputDirectory: process.env.JEST_RESULT_OUTPUT_DIR || './_devops/test',
      },
    ],
  ],
  collectCoverage: true,
  coverageDirectory: process.env.JEST_RESULT_OUTPUT_DIR || './_devops/test',
  collectCoverageFrom: [
    'src/**/**.{js,ts,tsx,jsx}',
    '!src/*/*/*/app.{jsx,ts,tsx,jsx}',
    '!src/*/*/*/extension-registration.{jsx,ts,tsx,jsx}',
    '!src/*/*/*/index.{jsx,ts,tsx,jsx,js}',
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
  moduleNameMapper: {
    '^uuid$': 'uuid',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sss|styl)$': 'jest-css-modules',
  },
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './.babelrc.jest' }],
  },
};
module.exports = customJestConfig;
