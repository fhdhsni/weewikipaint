const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
  devtool: 'source-map',
  context: path.join(__dirname, 'src'),
  resolve: {
    extensions: ['*', '.ts', '.json', '.js'],
  },
  entry: {
    app: path.join(__dirname, 'src', 'scripts', 'app.ts'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: /src/,
        use: [
          { loader: 'awesome-typescript-loader' },
          { loader: 'tslint-loader' }],
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        }),
      },
    ],
  },
  devServer: {
    inline: true,
    stats: 'errors-only',
    contentBase: path.join(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      inlineSource: 'css$',
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new ExtractTextPlugin('styles.[hash:10].css'),
    new LoaderOptionsPlugin({
      options: {
        tslint: {
          configFile: path.join(__dirname, 'tslint.json'),
          emitErrors: false,
          failOnHint: true,
          typeCheck: false,
          tsConfigFile: path.join(__dirname, 'tsconfig.json'),
        },
      },
    }),
  ],
};
