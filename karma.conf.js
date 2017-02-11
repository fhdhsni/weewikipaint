const webpackConf = require('./webpack.development.js');

webpackConf.entry = {};

const configuration = {
  basePath: '',
  customLaunchers: {
    Chrome_travis_ci: {
      base: 'Chrome',
      flags: ['--no-sandbox'],
    },
  },
  frameworks: ['mocha'],
  files: [
    'test/**/*.test.ts',
  ],
  // exclude: [
  //   '**/*.ts'
  // ],
  preprocessors: {
    'test/*test.ts': ['webpack', 'sourcemap'],
    'test/**/*test.ts': ['webpack', 'sourcemap'],
  },
  webpack: webpackConf,
  webpackMiddleware: {
    stats: 'errors-only',
  },
  reporters: ['dots'],
  port: 9876,
  colors: true,
  // logLevel: config.LOG_INFO,
  autoWatch: false,
  browsers: ['Chrome'],
  singleRun: false,
  concurrency: Infinity,
  plugins: [
    require('karma-webpack'),
    require('karma-mocha'),
    require('karma-mocha-reporter'),
    'karma-chrome-launcher',
  ],
};

if (process.env.USER === 'farhad') {
  process.env.CHROME_BIN = 'chromium';
}
if (process.env.TRAVIS) {
  configuration.browsers = ['Chrome_travis_ci'];
}
module.exports = function (config) {
  config.set(configuration);
};
