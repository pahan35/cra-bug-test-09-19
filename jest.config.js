const {sep} = require('path')

module.exports = {
  testMatch: [
    '**/!(*.it).test.[jt]s?(x)',
    process.env.INTEGRATION === '0' ? '' : '**/*.it.test.[jt]s?(x)',
  ],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.[t|j]sx?$': '<rootDir>/config/jest/babelizer.js',
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js",
  },
  transformIgnorePatterns: ['.*/signal-exit/.*'],
  moduleDirectories: ['<rootDir>/node_modules'],
  verbose: true,
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'jest',
        addFileAttribute: 'true',
        outputDirectory: `${__dirname}${sep}artifacts`,
        outputName: 'junit-jest.xml',
      },
    ],
  ],
}
