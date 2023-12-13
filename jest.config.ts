/* eslint-disable */
export default {
  displayName: 'contentstack-delivery',
  preset: './jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverage: true,
  coverageDirectory: './reports/contentstack-delivery/coverage/',
   collectCoverageFrom: [
    "src/**",
    "!src/index.ts"
  ],
  coverageThreshold: {
    // global: {
    //   branches: 95,
    //   functions: 95,
    //   lines: 95,
    //   statements: 95
    // }
  },
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './reports/contentstack-delivery/html',
        filename: 'index.html',
        expand: true,
      },
    ],
    [
      'jest-junit',
      {
        outputDirectory: 'reports/contentstack-delivery/junit',
        outputName: 'jest-junit.xml',
        ancestorSeparator: ' › ',
        uniqueOutputName: 'false',
        suiteNameTemplate: '{filepath}',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
      },
    ],
  ],
};
