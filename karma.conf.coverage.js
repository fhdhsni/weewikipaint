/* eslint-disable import/no-extraneous-dependencies, global-require */
const defaultConf = require('./karma.conf.js')();

const configuration = {
  customLaunchers: {
    Chrome_travis_ci: {
      base: 'Chrome',
      flags: ['--no-sandbox'],
    },
  },
  basePath: defaultConf.basePath,
  hostname: defaultConf.hostname,
  frameworks: defaultConf.frameworks,
  files: defaultConf.files,
  exclude: defaultConf.exclude,
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
  port: defaultConf.port,
  colors: defaultConf.port,
  autoWatch: defaultConf.port,
  browsers: ['Chrome_travis_ci'],
  singleRun: true,
  concurrency: Infinity,
  logLevel: 'LOG_INFO',
  plugins: [
    require('karma-sourcemap-loader'),
    require('karma-webpack'),
    require('karma-mocha'),
    require('karma-mocha-reporter'),
    require('karma-coverage'),
    require('istanbul-instrumenter-loader'),
    'karma-chrome-launcher',
  ],
};

module.exports = (config) => {
  config.set(configuration);
};
