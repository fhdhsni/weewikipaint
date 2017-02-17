const customLaunchers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 7',
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
  },
  sl_mac_safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.10',
  },

  sl_ie_10: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8',
    version: '10',
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11',
  },
  sl_edge: {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
  },
  sl_ios_safari_8: {
    base: 'SauceLabs',
    browserName: 'iphone',
    version: '8.4',
  },
  sl_ios_safari_9: {
    base: 'SauceLabs',
    browserName: 'iphone',
    version: '9.3',
  },
  sl_android_4_4: {
    base: 'SauceLabs',
    browserName: 'android',
    version: '4.4',
  },
  sl_android_5_1: {
    base: 'SauceLabs',
    browserName: 'android',
    version: '5.1',
  },
};

// const customLaunchers = {
//   sl_chrome: {
//     base: 'SauceLabs',
//     browserName: 'chrome',
//     platform: 'Windows 7',
//   },
//   sl_firefox: {
//     base: 'SauceLabs',
//     browserName: 'firefox',
//   },
//   sl_ie_11: {
//     base: 'SauceLabs',
//     browserName: 'internet explorer',
//     platform: 'Windows 8.1',
//     version: '11',
//   },
// };

const configuration = {
  basePath: '',
  customLaunchers,
  browsers: Object.keys(customLaunchers),
  sauceLabs: {
    testName: 'weewikipaint unit tests',
    recordScreenshots: false,
    connectOptions: {
      'no-ssl-bump-domains': 'all', // Ignore SSL error on Android emulator
      port: 5757,
      logfile: 'sauce_connect.log',
    },
    public: 'public',
  },
  frameworks: ['mocha'],
  files: [
    'test/compiled/test/client/*.js',
  ],
  exclude: [
    'test/compiled/test/client/*.selenium.test.js',
  ],
  preprocessors: {
    'test/**/*test.js': ['webpack'],
  },
  webpack: {
    resolve: {
      extensions: ['.js'],
    },
  },
  webpackMiddleware: {
    stats: 'errors-only',
  },
  reporters: ['dots', 'saucelabs'],
  singleRun: true,
  port: 9876,
  captureTimeout: 300000,
  browserNoActivityTimeout: 300000,
  plugins: [
    require('karma-webpack'),
    require('karma-mocha'),
    'karma-sauce-launcher',
  ],
};

module.exports = function (config) {
  config.set(configuration);
};
