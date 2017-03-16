/* eslint no-process-env: "off" */
/* eslint no-undef: "off" */
/* eslint no-console: "off" */
/* eslint one-var: "off" */
/* eslint vars-on-top: "off" */

var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var connect = require('express');
var bodyParser = require('body-parser');
var commons = require('./webpack.config.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:8082',
      'webpack/hot/only-dev-server',
      'index.js'
    ],
    vendor: commons.vendor
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].js',
    devtoolModuleFilenameTemplate: '[resource-path]'
  },
  module: {
    loaders: commons.loaders
  },
  resolve: {
    modulesDirectories: commons.modulesDirectories,
    alias: {}
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Demo',
      template: 'app/index.html',
      inject: 'body',
      filename: 'index.html'
    })
  ],
  devtoolLineToLine: true
};

var compiler = webpack(config);

var server = new WebpackDevServer(compiler, {
  publicPath: '/',
  debug: true,
  hot: true,
  verbose: true,
  stats: {
    colors: true,
    assets:       false,
    chunks:       false,
    chunkModules: false,
    modules:      true
  }
});

  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());
  // server.use('*', useIndexHtmlFactory(compiler));
  server.use(connect.static('./app/assets'));

  server.listen(8082, '0.0.0.0', function () {
    console.log('Demo is available at', server.listeningApp._connectionKey);
  });
