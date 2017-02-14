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
    'test/compiled/test/client/*.js',
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
  browsers: ['PhantomJS'],
  singleRun: false,
  concurrency: Infinity,
  plugins: [
    require('karma-sourcemap-loader'),
    require('karma-webpack'),
    require('karma-mocha'),
    require('karma-mocha-reporter'),
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
module.exports = function (config) {
  config.set(configuration);
};
