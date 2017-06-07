/* eslint no-process-env: "off" */
/* eslint no-undef: "off" */
/* eslint no-console: "off" */
/* eslint one-var: "off" */
/* eslint vars-on-top: "off" */
var webpack = require('webpack');
var commons = require('./webpack.config.js');

var config = {
  entry: {
    index: [
      'ui/Framework.js'
    ]
    // vendor: commons.vendor
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].js',
    devtoolModuleFilenameTemplate: '[resource-path]',
    library: 'module.exports',
    libraryTarget: 'assign'
  },
  module: {
    rules: commons.rules
  },
  resolve: {
    modules: commons.modules,
    alias: {}
  },
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' })
  ]
};

var compiler = webpack(config);

compiler.run(()=>{
  console.log('Compiled successfully');
});
