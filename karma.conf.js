/* eslint-disable import/no-extraneous-dependencies, global-require */
const configuration = {
  basePath: '',
  hostname: '127.0.0.1',
  frameworks: ['mocha'],
  files: [
    'test/compiled/test/client/*.test.js',
  ],
  exclude: [
    'test/compiled/test/client/*.selenium.test.js',
  ],
  preprocessors: {
    'test/**/*test.js': ['webpack', 'sourcemap'],
  },
  webpack: {
    resolve: {
      extensions: ['.js'],
    },
    devtool: 'inline-source-map',
  },
  webpackMiddleware: {
    stats: 'errors-only',
  },
  reporters: ['progress'],
  port: 9876,
  colors: true,
  autoWatch: false,
  // browsers: ['PhantomJS'],
  browsers: [],
  singleRun: false,
  concurrency: Infinity,
  plugins: [
    require('karma-sourcemap-loader'),
    require('karma-webpack'),
    require('karma-mocha'),
    require('karma-mocha-reporter'),
    // 'karma-phantomjs-launcher',
  ],
};

if (process.env.USER === 'farhad') {
  process.env.CHROME_BIN = 'chromium';
}

module.exports = (config) => {
  try {
    config.set(configuration);
  } finally {
    return configuration;
  }
};
