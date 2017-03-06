/* eslint-disable max-len */
module.exports = {
  scripts: {
    default: './start.sh',
    build: 'nps test.forBuild && webpack --config ./webpack.production.js -p',
    rm: {
      script: 'nps rm.test,rm.dist',
      test: 'rm -rf ./test/compiled',
      dist: 'rm -rf ./dist',
    },
    tslint: 'tslint ./src/**/*.ts ./test/**/*.ts',
    ws: {
      script: 'webpack-dev-server --config ./webpack.development.js --host $(./findLocalIP.sh) --port 8080',
      local: 'webpack-dev-server --config ./webpack.development.js --port 8080',
      dist: 'serve -p 8000 ./dist/ ',
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
      forBuild: 'nps tsc,mocha.server && karma start --single-run # | tee ./testOutput.txt && ./checkBrowsers.sh',
    },
    mocha: {
      default: 'export serverProcess=$(./start.sh) && nps mocha.server,mocha.selenium; kill $serverProcess',
      travis: 'nps mocha.server,mocha.TravisSelenium',
      server: 'mocha ./test/compiled/test/server/*.js',
      selenium: 'mocha ./test/compiled/test/client/*.selenium.test.js',
      TravisSelenium: 'mocha ./test/compiled/test/client/*.selenium.test.js',
    },
    k: {
      start: 'karma start',
      run: 'nps mocha && ./tscwatch.sh && karma run | tee ./testOutput.txt && ./checkBrowsers.sh',
      emacs: 'nps mocha && ./tscwatch.sh && karma run &> ./testOutput.txt; ./sed.sh && ./checkBrowsers.sh',
      stop: 'karma stop',
    },
    WTF: {
      default: `echo -e '\n
      1. tswatch to watch server and test typescript files. \n
      2. ws to run webpack-dev-server in watch mode. \n
      3. k.s to start karma server. \n
      4. k.r to run the tests. \n
      5. mocha.server to run server side tests. \n
      6. mocha.selenium to run selenium tests. \n
      7. test.all to run all the tests the way Travis do. \n
      8. build to build for production. \n'`,
    },
  },
  options: {
    silent: true,
  },
};
