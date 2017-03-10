/* eslint-disable max-len */
module.exports = {
  scripts: {
    default: './start.sh',
    build: 'karma run && webpack --config ./webpack.production.js -p && nps mocha',
    rm: {
      script: 'nps rm.test,rm.dist',
      test: 'rm -rf ./test/compiled',
      dist: 'rm -rf ./dist',
    },
    tslint: 'tslint ./src/**/*.ts ./test/**/*.ts',
    ws: {
      script: 'webpack-dev-server --config ./webpack.development.js --host $(./findLocalIP.sh) --port 8080',
      local: 'webpack-dev-server --config ./webpack.development.js --port 8080',
    },
    tsc: {
      default: 'nps rm.test,tsc.server,tsc.test',
      server: 'tsc ./src/server/*.ts -m \'CommonJS\' -t \'ES6\'',
      test: 'tsc -p ./test/tsconfigForTests.json',
      watch: {
        server: 'nps tsc.server --watch',
        test: 'nps tsc.test --watch',
      },
    },
    tswatch: 'nps -p tsc.watch.server,tsc.watch.test',
    test: {
      travis: 'nps tsc && karma start ./karma.sauce.config.js && nps mocha.travis',
      all: 'nps tsc,mocha && karma start --single-run',
    },
    mocha: {
      default: 'nps mocha.server && export serverProcess=$(./start.sh) && nps mocha.selenium; kill $serverProcess',
      travis: 'nps mocha.server,mocha.selenium',
      server: 'mocha ./test/compiled/test/server/*.js',
      selenium: 'mocha ./test/compiled/test/client/*.selenium.test.js',
    },
    k: {
      start: 'karma start',
      run: 'nps mocha && ./tscwatch.sh && karma run | tee ./testOutput.txt && ./checkBrowsers.sh',
      emacs: 'nps mocha && ./tscwatch.sh && karma run &> ./testOutput.txt; ./sed.sh && ./checkBrowsers.sh',
      stop: 'karma stop',
    },
    WTF: {
      default: `echo -e '\n
      1. \\e[35mtswatch\\e[0m to watch server and test typescript files. \n
      2. \\e[35mws\\e[0m to run webpack-dev-server in watch mode. \n
      3. \\e[35mk.s\\e[0m to start karma server. \n
      4. \\e[35mk.r\\e[0m to run the tests. \n
      5. \\e[35mmocha.server\\e[0m to run server side tests. \n
      6. \\e[35mmocha.selenium\\e[0m to run selenium tests. \n
      7. \\e[35mtest.all\\e[0m to run all the tests the way Travis do. \n
      8. \\e[35mbuild\\e[0m to build for production. \n'`,
    },
  },
  options: {
    silent: true,
  },
};
