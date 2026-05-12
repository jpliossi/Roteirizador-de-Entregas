/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Routing API Test Report',
      outputPath: './test-report.html',
      includeFailureMsg: true
    }]
  ]
};