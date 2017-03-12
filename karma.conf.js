/* eslint-disable import/no-extraneous-dependencies, global-require */
const configuration = {
  basePath: '',
  hostname: '127.0.0.1',
  customLaunchers: {
    Chrome_travis_ci: {
      base: 'Chrome',
      flags: ['--no-sandbox'],
    },
  },
  frameworks: ['mocha'],
  files: [
    'test/compiled/test/client/*.test.js',
  ],
  exclude: [
    'test/compiled/test/client/*.selenium.test.js',
  ],
  preprocessors: {
    'test/**/*test.js': ['webpack', 'sourcemap'],
    './test/compiled/src/scripts/*.js': ['coverage'],
  },
  coverageReporter: {
    dir: 'coverage/',
    reporters: [
      { type: 'json', subdir: 'report-json' },
    ],
  },
  webpack: {
    resolve: {
      extensions: ['.js'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: /test\/compiled\/src/,
          exclude: /node_modules/,
          loader: 'istanbul-instrumenter-loader',
        },
      ],
    },
    devtool: 'inline-source-map',
  },
  webpackMiddleware: {
    stats: 'errors-only',
  },
  reporters: ['progress', 'coverage'],
  coverageIstanbulReporter: {
    reports: ['text-summary'],
    fixWebpackSourcePaths: true,
  },
  port: 9876,
  colors: true,
  autoWatch: false,
  browsers: ['PhantomJS'],
  singleRun: false,
  concurrency: Infinity,
  plugins: [
    require('karma-sourcemap-loader'),
    require('karma-webpack'),
    require('karma-mocha'),
    require('karma-mocha-reporter'),
    require('karma-coverage'),
    require('istanbul-instrumenter-loader'),
    'karma-chrome-launcher',
    'karma-phantomjs-launcher',
    'karma-firefox-launcher',
  ],
};

if (process.env.USER === 'farhad') {
  process.env.CHROME_BIN = 'chromium';
}
if (process.env.TRAVIS) {
  configuration.browsers = ['Chrome_travis_ci'];
}
module.exports = (config) => {
  config.set(configuration);
};
