/* eslint-disable max-len */
module.exports = {
  scripts: {
    default: 'PORT=5000 && node ./src/server/weewikipaint.js $PORT',
    build: 'nps test.forBuild && webpack --config ./webpack.production.js -p',
    rm: {
      script: 'nps rm.test,rm.dist',
      test: 'rm -rf ./test/compiled',
      dist: 'rm -rf ./dist',
    },
    tslint: 'tslint ./src/**/*.ts ./test/**/*.ts',
    ws: {
      script: 'webpack-dev-server --config ./webpack.development.js --host $(./findLocalip.sh) --port 8080',
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
      default: 'servePort=$(./runServe.sh) && nps tsc,mocha && karma start --single-run; kill $servePort',
      forBuild: 'nps tsc,mocha.server && karma start --single-run # | tee ./testOutput.txt && ./checkBrowsers.sh',
    },
    mocha: {
      default: 'nps mocha.server,mocha.selenium',
      server: 'mocha ./test/compiled/test/server/*.js',
      selenium: 'mocha ./test/compiled/test/client/*.selenium.test.js',
    },
    k: {
      start: 'karma start',
      run: 'nps mocha && ./tscwatch.sh && karma run | tee ./testOutput.txt && ./checkBrowsers.sh',
      stop: 'karma stop',
    },
  },
  options: {
    silent: false,
  },
};
