const devConfig = require('./webpack.dev.config');
const webpack = require('webpack');
const plugins = devConfig.plugins;
const modules = devConfig.module;

plugins.push(new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: true,
  },
}));
// modules.rules[1].loaders[1] = 'css?minimize';
module.exports = {
  devtool: false,
  context: devConfig.context,
  resolve: devConfig.resolve,
  entry: devConfig.entry,
  output: devConfig.output,
  module: modules,
  plugins,
};

