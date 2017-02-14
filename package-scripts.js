/* eslint-disable max-len */
module.exports = {
  scripts: {
    default: 'PORT=5000 && node ./src/server/weewikipaint.js $PORT',
    build: 'nps test && webpack --config ./webpack.production.js -p',
    rm: 'rm -rf ./dist ./test/test ./test/src',
    tslint: 'tslint ./src/**/*.ts ./test/**/*.ts',
    ws: {
      script: 'webpack-dev-server --config ./webpack.development.js --host $(./findLocalip.sh)',
      description: 'run webpack-dev-server',
    },
    tsc: {
      default: 'nps tsc.server,tsc.test',
      server: 'tsc ./src/server/*.ts -m \'CommonJS\' -t \'ES6\'',
      test: 'tsc -p ./test/tsconfig.json',
      watch: {
        server: 'nps tsc.server --watch',
        test: 'nps tsc.test --watch',
      },
    },
    tswatch: 'nps -p tsc.watch.server,tsc.watch.test',
    test: 'nps tsc,mocha && karma start --single-run # | tee ./testOutput.txt && ./checkBrowsers.sh',
    mocha: 'mocha ./test/compiled/test/server/*.js',
    k: {
      start: 'karma start',
      run: 'nps mocha && ./tscwatch.sh && karma run | tee ./testOutput.txt && ./checkBrowsers.sh',
      stop: 'karma stop',
    },
  },
  options: {
    silent: true,
  },
};
